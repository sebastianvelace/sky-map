import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const thumbnailSrc = entry.imageBase64;

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-transparent transition-all duration-300 hover:border-white/20 hover:bg-white/5"
      onClick={() => onClick(entry)}
      role="button"
      tabIndex={0}
      aria-label={`Ver análisis de ${entry.extractedName || 'cielo nocturno'}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(entry)}
    >
      <div className="relative aspect-video overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border border-white/15 border-t-white/50 animate-spin" />
          </div>
        )}
        <img
          src={thumbnailSrc}
          alt="Foto del cielo analizada"
          className={`
            h-full w-full object-cover transition-opacity duration-500
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <button
          type="button"
          onClick={handleDelete}
          className={`
            absolute right-2 top-2 border p-2 transition-all duration-300
            ${showConfirm
              ? 'border-red-400/50 bg-red-950/30 text-red-200'
              : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white'
            }
          `}
          aria-label={showConfirm ? 'Confirmar eliminación' : 'Eliminar entrada'}
        >
          <Trash2 size={14} strokeWidth={1} />
        </button>

        {showConfirm && (
          <span className="absolute right-12 top-2 border border-white/10 bg-slate-950/80 px-2 py-1 text-[10px] font-light uppercase tracking-wider text-white">
            ¿Borrar?
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h4 className="truncate text-sm font-light text-white">
          {entry.extractedName || 'Análisis del cielo'}
        </h4>

        <p className="text-xs font-light text-slate-400">
          {formattedDate}
        </p>

        <p className="line-clamp-2 text-xs font-light leading-relaxed text-slate-400">
          {entry.result.replace(/[#*•★]/g, '').substring(0, 100)}…
        </p>
      </div>
    </div>
  );
};

export default HistoryCard;
