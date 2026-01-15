import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Allowed origins - restrict to your app domains only
const ALLOWED_ORIGINS = [
  'https://id-preview--0e5b7791-a2db-4a38-834f-a3d5605b4cd4.lovable.app',
  'https://sky-map-bogota.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
];

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function checkRateLimit(clientId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientId);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

const ANALYSIS_PROMPT = `Analiza esta foto del cielo nocturno tomada en Bogotá, Colombia (latitud ~4.6°N, altitud ~2600m, posible contaminación lumínica). 

Identifica las constelaciones y estrellas principales visibles con alta confianza. Para cada una incluye:
- Nombre común
- Breve descripción
- 2-3 datos curiosos divertidos o interesantes (mitología, ciencia, historia)

Responde SIEMPRE en español, de forma entusiasta, amigable y educativa como un astrónomo apasionado guiando a un amigo. Usa emojis, formato bonito con listas y encabezados.

Ejemplo de formato:
🌟 ¡Wow, qué cielo!

## Constelaciones:
• **Orión** - El cazador...
  Datos curiosos:
  1. ...

## Estrellas:
• **Sirius** - La más brillante...`;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate origin
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn('Blocked request from unauthorized origin:', origin);
    return new Response(
      JSON.stringify({ error: 'Origen no autorizado' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Rate limiting by IP or fallback identifier
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  const { allowed, remaining } = checkRateLimit(clientIP);
  
  if (!allowed) {
    console.warn('Rate limit exceeded for client:', clientIP);
    return new Response(
      JSON.stringify({ error: '¡Demasiadas solicitudes! Espera un minuto antes de intentar de nuevo. ⏳' }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60'
        } 
      }
    );
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: 'Se requiere una imagen para analizar' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate mime type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedMimeTypes.includes(mimeType)) {
      return new Response(
        JSON.stringify({ error: 'Formato de imagen no válido. Usa JPG, PNG o WebP.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate base64 size (max ~10MB image)
    if (imageBase64.length > 10 * 1024 * 1024 * 1.37) {
      return new Response(
        JSON.stringify({ error: 'La imagen es demasiado grande. Máximo 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key no configurada en el servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Gemini API for client:', clientIP, 'Remaining requests:', remaining);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: ANALYSIS_PROMPT },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: '¡Demasiadas solicitudes al servicio de IA! Espera un momento e intenta de nuevo.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 400) {
        return new Response(
          JSON.stringify({ error: 'Error al procesar la imagen. Intenta con otra foto.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Error al conectar con el servicio de análisis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');

    const analysisResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisResult) {
      return new Response(
        JSON.stringify({ error: 'No se pudo analizar la imagen. Intenta con una foto más clara del cielo.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ result: analysisResult }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': remaining.toString()
        } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-sky function:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
