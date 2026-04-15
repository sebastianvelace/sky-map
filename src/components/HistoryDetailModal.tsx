import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { HistoryEntry } from '@/hooks/useHistoryStorage';
import ResultCard from './ResultCard';

interface HistoryDetailModalProps {
  entry: HistoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryDetailModal = ({ entry, isOpen, onClose }: HistoryDetailModalProps) => {
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
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pb-12 pt-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-slate-950/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 mt-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 border border-white/10 bg-transparent p-2 text-white transition-all duration-300 hover:border-white/25 hover:bg-white/5"
              aria-label="Cerrar modal"
            >
              <X size={18} strokeWidth={1} />
            </button>

            <div className="relative h-52 overflow-hidden sm:h-56">
              <img src={entry.imageBase64} alt="Foto del cielo analizada" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 space-y-2 p-6">
                <h2
                  id="history-modal-title"
                  className="text-sm font-extralight uppercase tracking-[0.28em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                >
                  {entry.extractedName || 'Análisis del cielo'}
                </h2>
                <p className="text-xs font-light capitalize text-slate-400">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="max-h-[58vh] overflow-y-auto px-5 py-6 md:px-8 md:py-8 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
              <ResultCard result={entry.result} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default HistoryDetailModal;
