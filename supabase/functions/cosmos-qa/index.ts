import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  'https://id-preview--0e5b7791-a2db-4a38-834f-a3d5605b4cd4.lovable.app',
  'https://sky-map-bogota.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
];

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60 * 1000;

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

const COSMOS_PROMPT = `Eres un astrónomo apasionado y poeta del cosmos. Responde preguntas sobre astronomía, constelaciones, estrellas, planetas y fenómenos celestes de manera educativa, inspiradora y poética.

INSTRUCCIONES DE FORMATO (MUY IMPORTANTES):
• Responde SIEMPRE en español
• Sé conciso pero completo (200-500 palabras máximo)
• Usa formato markdown limpio y elegante
• Usa **negrita** para nombres importantes de estrellas, constelaciones y planetas
• Usa • para listas (NO uses guiones -)
• Usa emojis con moderación para dar vida (🌟 ✨ 🔭 💫 🌙 🪐)
• Organiza con encabezados ## si la respuesta es larga
• Escribe de forma poética pero informativa
• Incluye datos curiosos cuando sea relevante
• Si preguntan sobre visibilidad, da información general aplicable globalmente

Sé amigable y entusiasta, como un guía apasionado del cosmos.`;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn('Blocked request from unauthorized origin:', origin);
    return new Response(
      JSON.stringify({ error: 'Origen no autorizado' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

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
    const { question } = await req.json();

    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: 'Por favor, escribe una pregunta válida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (question.length > 500) {
      return new Response(
        JSON.stringify({ error: 'La pregunta es demasiado larga. Máximo 500 caracteres.' }),
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

    console.log('Cosmos QA request from client:', clientIP, 'Question:', question.slice(0, 50));

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
                { text: COSMOS_PROMPT },
                { text: `Pregunta del usuario: ${question}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
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
      
      return new Response(
        JSON.stringify({ error: 'Error al conectar con el servicio de análisis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');

    const answerResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answerResult) {
      return new Response(
        JSON.stringify({ error: 'No se pudo generar una respuesta. Intenta reformular tu pregunta.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ answer: answerResult }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': remaining.toString()
        } 
      }
    );

  } catch (error) {
    console.error('Error in cosmos-qa function:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
