import { useState, useRef, useEffect } from 'react';
import { Camera, Telescope, AlertCircle, Sparkles, Star } from 'lucide-react';
import StarField from '@/components/StarField';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultCard from '@/components/ResultCard';
import QuoteCarousel from '@/components/QuoteCarousel';
import { supabase } from '@/integrations/supabase/client';
import { useHistoryStorage } from '@/hooks/useHistoryStorage';

const Index = () => {
  const { addEntry } = useHistoryStorage();
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
        // Save to history
        if (image) {
          addEntry(image, data.result);
        }
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
    <div className="min-h-screen relative overflow-x-hidden pt-16">
      {/* Animated star background */}
      <StarField />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-5 py-10 md:py-14 max-w-xl">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14 animate-fade-in">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div 
                className="absolute inset-0 blur-2xl rounded-full animate-pulse-gold"
                style={{ background: 'radial-gradient(circle, hsl(45 100% 55% / 0.3) 0%, transparent 70%)' }}
              />
              <div 
                className="relative p-5 rounded-2xl border border-cosmic-gold/30"
                style={{
                  background: 'linear-gradient(135deg, hsl(225 35% 12% / 0.8) 0%, hsl(225 35% 8% / 0.6) 100%)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <Telescope className="w-10 h-10 md:w-12 md:h-12 text-cosmic-gold" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wide">
            <span className="text-cosmic-gold">★</span> Stars.ai
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-sm mx-auto mb-6">
            Identifica estrellas y constelaciones del cielo nocturno
          </p>

          {/* Rotating quotes carousel */}
          <QuoteCarousel />
        </header>

        {/* Camera capture section */}
        <section className="space-y-5 mb-8">
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
              className="w-full py-5 md:py-6 rounded-2xl font-semibold text-lg shadow-glow-blue hover:shadow-[0_0_50px_hsl(207_90%_70%_/_0.5)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 animate-pulse-glow btn-glow"
              style={{
                background: 'linear-gradient(135deg, hsl(207 90% 65%) 0%, hsl(207 90% 50%) 100%)',
                color: 'hsl(228 35% 5%)'
              }}
            >
              <Camera size={24} />
              <span>Tomar foto del cielo</span>
            </button>
          )}

          {/* Image preview */}
          {image && (
            <div className="space-y-5 animate-fade-in-scale">
              <div className="relative rounded-3xl overflow-hidden border border-border/30 shadow-card">
                <img
                  src={image}
                  alt="Foto del cielo nocturno"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  onClick={resetApp}
                  className="flex-1 py-4 glass-button hover:bg-secondary/60 text-foreground rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-border/30"
                >
                  <Camera size={18} />
                  Nueva foto
                </button>
                
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-[2] py-4 rounded-2xl font-semibold shadow-glow-gold hover:shadow-[0_0_50px_hsl(45_100%_55%_/_0.5)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-gold-glow"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 100% 55%) 0%, hsl(38 90% 50%) 100%)',
                    color: 'hsl(228 35% 5%)'
                  }}
                >
                  <Sparkles size={18} />
                  <span>Analizar mi cielo ✨</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Loading state */}
        {isAnalyzing && <LoadingSpinner />}

        {/* Error message */}
        {error && (
          <div className="glass-card rounded-2xl p-5 flex items-start gap-4 mb-8 border-destructive/30 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-foreground text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && <ResultCard result={result} />}

        {/* Footer note */}
        <footer className="mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 text-muted-foreground/50 text-xs">
            <Star size={12} className="text-cosmic-gold/60" />
            <span>Stars.ai — Powered by Google Gemini</span>
            <Star size={12} className="text-cosmic-gold/60" />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;