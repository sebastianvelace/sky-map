import { useEffect, useCallback } from 'react';
import { X, Calendar, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { HistoryEntry } from '@/hooks/useHistoryStorage';
import ResultCard from './ResultCard';

interface HistoryDetailModalProps {
  entry: HistoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryDetailModal = ({ entry, isOpen, onClose }: HistoryDetailModalProps) => {
  // Handle ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const formattedDate = entry
    ? new Date(entry.timestamp).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
      })
    : '';

  return (
    <AnimatePresence>
      {isOpen && entry ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pb-10 pt-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-cosmic-blue/20 bg-[#070b1a]/95 shadow-[0_0_40px_rgba(20,81,138,0.25)]"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-full border border-cosmic-blue/30 bg-background/50 p-2 transition-colors hover:bg-background/80"
              aria-label="Cerrar modal"
            >
              <X size={20} className="text-foreground" />
            </button>

            <div className="relative h-56 overflow-hidden">
              <img src={entry.imageBase64} alt="Foto del cielo analizada" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b1a] via-[#070b1a]/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-2 flex items-center gap-2 text-cosmic-gold">
                  <Star size={16} />
                  <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                    {entry.extractedName || 'Análisis del cielo'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar size={14} />
                  <span className="capitalize">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5 pr-3 md:p-6 md:pr-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cosmic-blue/50 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2">
              <div className="rounded-2xl border border-cosmic-blue/20 bg-black/20 p-1 [&_.result-content]:space-y-2 [&_.result-content_h1]:tracking-wide [&_.result-content_h1]:leading-snug [&_.result-content_h2]:tracking-wide [&_.result-content_h2]:leading-snug [&_.result-content_h3]:tracking-wide [&_.result-content_p]:leading-8 [&_.result-content_p]:text-[1.03rem] [&_.result-content_li]:leading-8 [&_.result-content_li]:text-[1.02rem]">
                <ResultCard result={entry.result} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default HistoryDetailModal;
