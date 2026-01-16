import { useEffect, useCallback } from 'react';
import { X, Star, Sparkles, BookOpen, Telescope } from 'lucide-react';
import type { ConstellationData } from './ConstellationCard';

interface ConstellationModalProps {
  constellation: ConstellationData;
  isOpen: boolean;
  onClose: () => void;
}

const ConstellationModal = ({ constellation, isOpen, onClose }: ConstellationModalProps) => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md animate-fade-in" />

      {/* Modal content */}
      <div 
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-3xl animate-fade-in-scale"
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

        {/* Header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={constellation.imageUrl}
            alt={constellation.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
              style={{ 
                backgroundColor: `${constellation.color}20`,
                color: constellation.color,
                border: `1px solid ${constellation.color}40`
              }}
            >
              {constellation.latinName}
            </div>
            <h2 id="modal-title" className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              {constellation.name}
              <Star size={24} className="text-cosmic-gold animate-pulse-gold" />
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Visibility info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-button rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Visibilidad</p>
              <p className="text-sm font-medium text-cosmic-blue">{constellation.visibility}</p>
            </div>
            <div className="glass-button rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Mejor hora</p>
              <p className="text-sm font-medium text-cosmic-gold">{constellation.bestTime}</p>
            </div>
            <div className="glass-button rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Dirección</p>
              <p className="text-sm font-medium text-cosmic-purple">{constellation.direction}</p>
            </div>
            <div className="glass-button rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Brillo</p>
              <p className="text-sm font-medium text-cosmic-gold">{constellation.brightness}</p>
            </div>
          </div>

          {/* Mythology */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cosmic-gold">
              <BookOpen size={18} />
              <h3 className="font-display font-semibold">Mitología</h3>
            </div>
            <p className="text-sm text-cosmic-text leading-relaxed">
              {constellation.mythology}
            </p>
          </div>

          {/* Fun facts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cosmic-blue">
              <Telescope size={18} />
              <h3 className="font-display font-semibold">Datos Astronómicos</h3>
            </div>
            <ul className="space-y-2">
              {constellation.funFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-cosmic-text">
                  <Sparkles size={14} className="text-cosmic-gold mt-1 flex-shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Note about visibility */}
          <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border/30">
            ✨ Visibilidad optimizada para latitud ~4.7°N (Colombia, Ecuador, Venezuela)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstellationModal;
