import { useEffect, useCallback } from 'react';
import { X, Calendar, Star } from 'lucide-react';
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

  if (!isOpen || !entry) return null;

  const formattedDate = new Date(entry.timestamp).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto pt-8 pb-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/90 backdrop-blur-md animate-fade-in" />

      {/* Modal content */}
      <div 
        className="relative z-10 w-full max-w-2xl glass-card rounded-3xl animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={20} className="text-foreground" />
        </button>

        {/* Header with image */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img
            src={entry.imageBase64}
            alt="Foto del cielo analizada"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Date overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 text-cosmic-gold mb-2">
              <Star size={18} />
              <span className="text-sm font-medium">{entry.extractedName || 'Análisis del cielo'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Result content */}
        <div className="p-6">
          <ResultCard result={entry.result} />
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailModal;
