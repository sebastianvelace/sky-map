import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Telescope,
  AlertCircle,
  Sparkles,
  Star,
  Orbit,
  Rocket,
  Radar,
  Satellite,
  Stars,
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultCard from '@/components/ResultCard';
import QuoteCarousel from '@/components/QuoteCarousel';
import CosmosQA from '@/components/CosmosQA';
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

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const conoItems = [
    { name: 'Andrómeda', icon: Orbit, active: true },
    { name: 'Orión', icon: Stars, active: false },
    { name: 'Pegaso', icon: Rocket, active: false },
    { name: 'Casiopea', icon: Radar, active: false },
    { name: 'Aquila', icon: Satellite, active: false },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden pt-20">
      <div className="fixed inset-0 z-[-10]">
        <img
          src="/bg-cosmos.jpg"
          alt="Cosmos background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/85" />
      </div>

      <main className="relative z-10 container mx-auto px-5 py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-12 gap-6"
        >
          <motion.aside
            variants={itemVariants}
            className="xl:col-span-3 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8"
          >
            <p className="text-xs tracking-[0.2em] text-slate-500 uppercase mb-6">CONOS</p>
            <div className="space-y-2">
              {conoItems.map(({ name, icon: Icon, active }) => (
                <button
                  key={name}
                  type="button"
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-slate-400 transition-all duration-300 cursor-pointer ${
                    active ? 'bg-slate-800/60 border border-slate-700 text-slate-50' : 'hover:bg-slate-800/60 hover:border hover:border-slate-700 hover:text-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{name}</span>
                </button>
              ))}
            </div>
          </motion.aside>

          <div className="xl:col-span-9 space-y-6">
            <motion.section
              variants={itemVariants}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80">
                      <Telescope className="w-10 h-10 text-sky-200" />
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-sky-200/70">
                    Stars.AI
                  </h1>
                  <p className="text-slate-300 text-base md:text-lg max-w-2xl">
                    Centro de telemetría celeste para identificar estrellas y constelaciones del cielo nocturno en tiempo real.
                  </p>
                </div>
                <div className="lg:max-w-sm w-full">
                  <QuoteCarousel />
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={itemVariants}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8"
            >
              <section className="space-y-5">
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
                    className="w-full py-5 md:py-6 rounded-2xl font-semibold text-lg shadow-[0_0_40px_rgba(56,189,248,0.25)] hover:shadow-[0_0_50px_rgba(56,189,248,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-sky-400 to-violet-500 text-slate-950"
                    aria-label="Tomar foto del cielo nocturno"
                  >
                    <Camera size={24} />
                    <span>Tomar foto del cielo</span>
                  </button>
                )}

                {image && (
                  <div className="space-y-5">
                    <div className="relative rounded-3xl overflow-hidden border border-slate-700/70 shadow-2xl shadow-slate-950/40">
                      <img
                        src={image}
                        alt="Foto del cielo nocturno"
                        className="w-full h-auto max-h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={resetApp}
                        className="flex-1 py-4 bg-slate-800/70 hover:bg-slate-700/80 text-slate-100 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700/80"
                        aria-label="Tomar nueva foto"
                      >
                        <Camera size={18} />
                        Nueva foto
                      </button>

                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="flex-[2] py-4 rounded-2xl font-semibold shadow-[0_0_40px_rgba(139,92,246,0.25)] hover:shadow-[0_0_55px_rgba(139,92,246,0.45)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-sky-400 text-slate-950"
                        aria-label="Analizar imagen del cielo"
                      >
                        <Sparkles size={18} />
                        <span>Analizar mi cielo ✨</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </motion.section>

            {isAnalyzing && (
              <motion.section
                variants={itemVariants}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8"
              >
                <LoadingSpinner />
              </motion.section>
            )}

            {error && (
              <motion.section
                variants={itemVariants}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8"
                role="alert"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-slate-100 text-sm leading-relaxed">{error}</p>
                </div>
              </motion.section>
            )}

            {result && !isAnalyzing && (
              <motion.section variants={itemVariants}>
                <ResultCard result={result} />
              </motion.section>
            )}

            <motion.section
              variants={itemVariants}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8"
            >
              <CosmosQA />
            </motion.section>

            <motion.footer variants={itemVariants} className="text-center pb-4">
              <div className="inline-flex items-center gap-2 text-slate-400/70 text-xs">
                <Star size={12} className="text-sky-200/70" />
                <span>Stars.ai — Powered by Google Gemini</span>
                <Star size={12} className="text-sky-200/70" />
              </div>
            </motion.footer>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
