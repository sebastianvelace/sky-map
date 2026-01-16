import { useState } from 'react';
import { Trash2, Calendar, Star } from 'lucide-react';
import type { HistoryEntry } from '@/hooks/useHistoryStorage';

interface HistoryCardProps {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
  onClick: (entry: HistoryEntry) => void;
}

const HistoryCard = ({ entry, onDelete, onClick }: HistoryCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedDate = new Date(entry.timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showConfirm) {
      onDelete(entry.id);
    } else {
      setShowConfirm(true);
      // Reset confirm state after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  // Create a smaller thumbnail version
  const thumbnailSrc = entry.imageBase64;

  return (
    <div 
      className="group glass-card rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-blue"
      onClick={() => onClick(entry)}
      role="button"
      tabIndex={0}
      aria-label={`Ver análisis de ${entry.extractedName || 'cielo nocturno'}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(entry)}
    >
      {/* Image thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={thumbnailSrc}
          alt="Foto del cielo analizada"
          className={`
            w-full h-full object-cover transition-all duration-500
            group-hover:scale-105 group-hover:brightness-110
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />
        
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={`
            absolute top-2 right-2 p-2 rounded-full transition-all duration-300
            ${showConfirm 
              ? 'bg-destructive text-destructive-foreground scale-110' 
              : 'bg-background/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground'
            }
          `}
          aria-label={showConfirm ? 'Confirmar eliminación' : 'Eliminar entrada'}
        >
          <Trash2 size={14} />
        </button>
        
        {showConfirm && (
          <span className="absolute top-2 right-12 px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium animate-fade-in">
            ¿Borrar?
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Star size={14} className="text-cosmic-gold" />
          <h4 className="font-medium text-foreground text-sm truncate group-hover:text-cosmic-gold transition-colors">
            {entry.extractedName || 'Análisis del cielo'}
          </h4>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>

        {/* Preview of result */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {entry.result.replace(/[#*•★]/g, '').substring(0, 100)}...
        </p>
      </div>
    </div>
  );
};

export default HistoryCard;
