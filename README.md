# Stars.ai
Centro de telemetría celeste para identificación de estrellas y constelaciones.

## Descripción
Plataforma web diseñada para capturar y analizar el cielo nocturno mediante inteligencia artificial. El sistema permite la identificación de cuerpos celestes y patrones estelares a partir de fotografías, proporcionando datos técnicos y mitológicos.

## Características Técnicas
- Interfaz Naked UI: Diseño minimalista de alto contraste optimizado para entornos oscuros, eliminando contenedores y marcos visuales.
- Análisis de Imágenes: Procesamiento de fotografías mediante modelos de visión para reconocimiento estelar.
- Historial: Almacenamiento local de capturas y resultados técnicos previos.
- Esquemas de Constelaciones: Representación geométrica de constelaciones mediante vectores SVG anatómicamente precisos.
- CosmosQA: Sistema de consulta interactiva sobre astronomía integrado en la plataforma.

## Stack Tecnológico
- Frontend: React, Vite.
- Estilos y Animaciones: Tailwind CSS, Framer Motion.
- Iconografía: Lucide React.
- Backend: Supabase (Edge Functions).
- IA: Google Gemini API.

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias:
   npm install
3. Configurar variables de entorno (.env):
   VITE_SUPABASE_URL=tu_url
   VITE_SUPABASE_ANON_KEY=tu_key
4. Iniciar servidor de desarrollo:
   npm run dev

## Despliegue
El proyecto está configurado para ser desplegado en plataformas compatibles con aplicaciones Vite y funciones de Supabase.
