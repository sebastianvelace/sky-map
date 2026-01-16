import { useState } from 'react';
import { History as HistoryIcon, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import StarField from '@/components/StarField';
import HistoryCard from '@/components/HistoryCard';
import HistoryDetailModal from '@/components/HistoryDetailModal';
import { useHistoryStorage, type HistoryEntry } from '@/hooks/useHistoryStorage';

const History = () => {
  const { entries, isLoading, clearAll } = useHistoryStorage();
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDelete = (id: string) => {
    // This will be passed to individual cards
    // The hook will handle the actual deletion
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden pt-20 pb-10">
      {/* Animated star background */}
      <StarField />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-5 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-10 md:mb-12 animate-fade-in">
          {/* Icon */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div 
                className="absolute inset-0 blur-2xl rounded-full animate-pulse-gold"
                style={{ background: 'radial-gradient(circle, hsl(45 100% 55% / 0.3) 0%, transparent 70%)' }}
              />
              <div 
                className="relative p-4 rounded-2xl border border-cosmic-gold/30"
                style={{
                  background: 'linear-gradient(135deg, hsl(225 35% 12% / 0.8) 0%, hsl(225 35% 8% / 0.6) 100%)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <HistoryIcon className="w-8 h-8 md:w-10 md:h-10 text-cosmic-gold" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Historial de Análisis
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Revisa tus observaciones anteriores del cielo nocturno
          </p>

          {/* Entry count */}
          {entries.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-cosmic-blue">
              <Sparkles size={14} />
              <span>{entries.length} {entries.length === 1 ? 'análisis guardado' : 'análisis guardados'}</span>
            </div>
          )}
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && entries.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="glass-card rounded-3xl p-8 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Historial vacío
              </h3>
              <p className="text-muted-foreground text-sm">
                Cuando analices fotos del cielo nocturno, tus resultados aparecerán aquí automáticamente.
              </p>
            </div>
          </div>
        )}

        {/* History entries */}
        {!isLoading && entries.length > 0 && (
          <>
            {/* Clear all button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleClearAll}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${showClearConfirm 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'glass-button text-muted-foreground hover:text-destructive'
                  }
                `}
                aria-label={showClearConfirm ? 'Confirmar borrar todo' : 'Borrar todo el historial'}
              >
                <Trash2 size={16} />
                <span>{showClearConfirm ? '¿Confirmar?' : 'Borrar todo'}</span>
              </button>
            </div>

            {/* Grid of history cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {entries.map((entry, index) => (
                <div 
                  key={entry.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className="animate-fade-in"
                >
                  <HistoryCard 
                    entry={entry}
                    onDelete={handleDelete}
                    onClick={setSelectedEntry}
                  />
                </div>
              ))}
            </section>
          </>
        )}

        {/* Footer note */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/60">
            El historial se guarda localmente en tu dispositivo 🔒
          </p>
        </footer>
      </main>

      {/* Detail modal */}
      <HistoryDetailModal 
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
};

export default History;
