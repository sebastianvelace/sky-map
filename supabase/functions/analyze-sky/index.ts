import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: 'Se requiere una imagen para analizar' }),
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

    console.log('Calling Gemini API with model gemini-2.5-flash...');

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
          JSON.stringify({ error: '¡Demasiadas solicitudes! Espera un momento e intenta de nuevo.' }),
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-sky function:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
