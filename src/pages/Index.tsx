import { useState, useRef } from 'react';
import { Camera, Telescope, AlertCircle, Sparkles, Star } from 'lucide-react';
import StarField from '@/components/StarField';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultCard from '@/components/ResultCard';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async () => {
    if (!image) {
      setError('Por favor, primero toma una foto del cielo nocturno 📷');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data from data URL
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const { data, error: functionError } = await supabase.functions.invoke('analyze-sky', {
        body: { 
          imageBase64: base64Data, 
          mimeType 
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Error al conectar con el servidor');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.result) {
        setResult(data.result);
      } else {
        throw new Error('No se pudo obtener el análisis. Intenta con otra foto más clara del cielo. 🌃');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al analizar');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Star background */}
      <StarField />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cosmic-gold/20 blur-xl rounded-full animate-pulse" />
              <div className="relative p-4 bg-gradient-to-br from-cosmic-navy to-card border border-cosmic-gold/30 rounded-2xl shadow-glow-gold">
                <Telescope className="w-10 h-10 md:w-12 md:h-12 text-cosmic-gold" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            <span className="text-cosmic-gold">★</span> Estrellas y Constelaciones
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
            Descubre las constelaciones del cielo nocturno de Bogotá
          </p>

          {/* Quote */}
          <blockquote className="mt-6 text-sm md:text-base text-muted-foreground/80 italic max-w-sm mx-auto border-l-2 border-cosmic-blue/50 pl-4">
            "For small creatures such as we, the vastness is bearable only through love."
            <footer className="text-xs text-muted-foreground/60 mt-1 not-italic">— Carl Sagan</footer>
          </blockquote>
        </header>

        {/* Camera capture section */}
        <section className="space-y-4 mb-6">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />

          {/* Camera button */}
          {!image && (
            <button
              onClick={triggerCamera}
              className="w-full py-5 md:py-6 bg-gradient-button text-primary-foreground rounded-2xl font-semibold text-lg shadow-glow-blue hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-pulse-glow"
            >
              <Camera size={24} />
              <span>Tomar foto del cielo</span>
            </button>
          )}

          {/* Image preview */}
          {image && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-cosmic">
                <img
                  src={image}
                  alt="Foto del cielo nocturno"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetApp}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  Nueva foto
                </button>
                
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-[2] py-3 bg-gradient-gold text-accent-foreground rounded-xl font-semibold shadow-glow-gold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-gold"
                >
                  <Sparkles size={18} />
                  <span>Analizar mi cielo 🌌</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Loading state */}
        {isAnalyzing && <LoadingSpinner />}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-foreground text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && <ResultCard result={result} />}

        {/* Footer note */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
            <Star size={12} className="text-cosmic-gold" />
            <span>Stars.ai — Powered by Google Gemini ✨</span>
          </p>
          <p className="text-[10px] text-muted-foreground/40 mt-2">
            Inspirado por SpaceX & NASA 🚀
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
