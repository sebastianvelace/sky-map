import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, Sparkles } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultCard from '@/components/ResultCard';
import QuoteCarousel from '@/components/QuoteCarousel';
import CosmosQA from '@/components/CosmosQA';
import { supabase } from '@/integrations/supabase/client';
import { useHistoryStorage } from '@/hooks/useHistoryStorage';

const constellations = [
  'Andrómeda',
  'Orión',
  'Pegaso',
  'Cisne',
  'Lira',
  'Osa Mayor',
  'Escorpión',
  'Casiopea',
];

const CONSTELLATION_PATHS: Record<string, string> = {
  'Andrómeda': 'M7 18 L12 12 L18 6 M12 12 L6 6 M15 9 L17 13',
  'Orión': 'M8 5 L16 5 L14 12 L10 12 Z M10 12 L7 20 L17 20 L14 12 M9 12 L15 12',
  'Pegaso': 'M8 10 L18 10 L16 20 L6 20 Z M18 10 L22 4 M8 10 L3 6',
  'Cisne': 'M12 3 L12 21 M5 11 L12 14 L19 9',
  'Lira': 'M12 4 L9 10 L15 10 L18 18 L6 18 Z',
  'Osa Mayor': 'M3 11 L8 9 L13 11 L15 17 L21 16 L19 10 L13 11',
  'Escorpión': 'M5 7 L10 5 L14 9 L13 16 L9 20 L5 17 L6 14',
  'Casiopea': 'M4 7 L9 17 L13 10 L17 16 L21 6',
};

const ConstellationIcon = ({ name, className }: { name: string; className?: string }) => {
  const d = CONSTELLATION_PATHS[name];
  if (!d) return null;

  const vertices = d.match(/[ML]\s*(\d+)\s+(\d+)/g)?.map((m) => {
    const [, x, y] = m.match(/(\d+)\s+(\d+)/)!;
    return { x: Number(x), y: Number(y) };
  }) ?? [];

  const unique = vertices.filter(
    (v, i, arr) => arr.findIndex((u) => u.x === v.x && u.y === v.y) === i
  );

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
      {unique.map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r="1" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
};

const Index = () => {
  const { addEntry } = useHistoryStorage();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeCono, setActiveCono] = useState<string | null>(null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-[-10]">
        <img
          src="/bg-cosmos.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/90" />
      </div>

      <main className="relative z-10 container mx-auto px-6 lg:px-10 pt-8 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-16"
        >
          {/* Sidebar — Constellation list */}
          <motion.aside variants={itemVariants} className="hidden xl:block pt-4">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase mb-8">
              CONOS
            </p>
            <nav className="space-y-1">
              {constellations.map((name) => {
                const isActive = activeCono === name;
                return (
                  <div key={name} className="relative">
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute top-1/2 right-full mr-3 -translate-y-1/2 text-white/80 pointer-events-none"
                          initial={{ opacity: 0, scale: 0.5, x: 20 }}
                          animate={{ opacity: 1, scale: 1.8, x: -40 }}
                          exit={{ opacity: 0, scale: 0.5, x: 20 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <ConstellationIcon name={name} className="w-8 h-8" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => setActiveCono(isActive ? null : name)}
                      className={`
                        w-full text-left py-2.5 px-1
                        text-sm font-extralight transition-all duration-300 cursor-pointer
                        ${isActive
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                        }
                      `}
                    >
                      {name}
                    </button>
                  </div>
                );
              })}
            </nav>
          </motion.aside>

          {/* Main content */}
          <div className="flex flex-col min-h-[calc(100dvh-5rem)]">
            {/* Hero — centrado en viewport, más grande */}
            <motion.section
              variants={itemVariants}
              className="min-h-[calc(100dvh-6.5rem)] flex flex-col items-center justify-center text-center px-2 py-8"
            >
              <h1 className="text-white font-extralight text-7xl sm:text-8xl lg:text-9xl uppercase tracking-[0.35em] sm:tracking-[0.4em] drop-shadow-[0_0_24px_rgba(255,255,255,0.65)] mb-10 lg:mb-12">
                Stars.AI
              </h1>
              <p className="text-slate-300 font-extralight text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed tracking-[0.2em] sm:tracking-[0.28em] uppercase">
                EXPLORING THE COSMIC VOID.
                <br />
                BEYOND THE HORIZON.
              </p>
              <div className="mt-12 lg:mt-14 w-full max-w-3xl mx-auto">
                <QuoteCarousel />
              </div>
            </motion.section>

            {/* Camera — más abajo, centrado */}
            <motion.section
              variants={itemVariants}
              className="flex justify-center mt-10 md:mt-16 lg:mt-24 mb-16 md:mb-20 lg:mb-24"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
              />

              {!image && (
                <button
                  onClick={triggerCamera}
                  className="group flex items-center justify-center gap-4 text-white/80 hover:text-white transition-all duration-300"
                  aria-label="Tomar foto del cielo nocturno"
                >
                  <span className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 group-hover:border-white/50 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                    <Camera size={22} className="text-white/70 group-hover:text-white transition-colors duration-300" />
                  </span>
                  <span className="text-sm font-light tracking-widest uppercase">
                    Tomar foto del cielo
                  </span>
                </button>
              )}

              {image && (
                <div className="space-y-8">
                  <div className="relative rounded-2xl overflow-hidden max-w-2xl">
                    <img
                      src={image}
                      alt="Foto del cielo nocturno"
                      className="w-full h-auto max-h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex gap-6">
                    <button
                      onClick={resetApp}
                      className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-light tracking-wider uppercase transition-all duration-300 hover:translate-x-1"
                      aria-label="Tomar nueva foto"
                    >
                      <Camera size={16} />
                      Nueva foto
                    </button>

                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 text-white text-sm font-light tracking-wider uppercase transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed hover:translate-x-1"
                      aria-label="Analizar imagen del cielo"
                    >
                      <Sparkles size={16} />
                      Analizar mi cielo
                    </button>
                  </div>
                </div>
              )}
            </motion.section>

            <div className="flex-1 space-y-16 lg:space-y-20 pb-8 min-h-0">
              {/* Loading */}
              {isAnalyzing && (
                <motion.section variants={itemVariants}>
                  <LoadingSpinner />
                </motion.section>
              )}

              {/* Error */}
              {error && (
                <motion.section variants={itemVariants} role="alert">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-4 h-4 text-red-400/80 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm font-light leading-relaxed">{error}</p>
                  </div>
                </motion.section>
              )}

              {/* Results */}
              {result && !isAnalyzing && (
                <motion.section variants={itemVariants}>
                  <ResultCard result={result} />
                </motion.section>
              )}
            </div>

            {/* Q&A — pegado al final del viewport cuando hay poco contenido */}
            <motion.section variants={itemVariants} className="mt-auto shrink-0 pt-16 lg:pt-24 pb-10 lg:pb-14">
              <CosmosQA />
            </motion.section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
