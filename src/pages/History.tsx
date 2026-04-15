import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import HistoryCard from '@/components/HistoryCard';
import HistoryDetailModal from '@/components/HistoryDetailModal';
import { useHistoryStorage, type HistoryEntry } from '@/hooks/useHistoryStorage';

const History = () => {
  const { entries, isLoading, clearAll, deleteEntry } = useHistoryStorage();
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDelete = (id: string) => {
    deleteEntry(id);
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
    <div className="min-h-screen relative overflow-x-hidden pt-8 pb-16">
      <div className="fixed inset-0 z-[-10]">
        <img
          src="/bg-cosmos.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/90" />
      </div>

      <main className="relative z-10 container mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col px-6 lg:px-10">
        <header className="mb-10 shrink-0 text-center lg:mb-12">
          <h1
            id="history-page-title"
            className="text-white font-extralight text-5xl uppercase tracking-[0.4em] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-8"
          >
            HISTORIAL
          </h1>

          {entries.length > 0 && (
            <p className="text-sm font-light text-slate-400 tracking-wide">
              {entries.length} {entries.length === 1 ? 'análisis guardado' : 'análisis guardados'}
            </p>
          )}
        </header>

        {isLoading && (
          <div className="flex justify-center py-24">
            <div className="h-10 w-10 rounded-full border border-white/20 border-t-white/70 animate-spin" />
          </div>
        )}

        {!isLoading && entries.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center py-8">
            <div className="mx-auto max-w-md border border-white/10 px-10 py-14 text-center">
              <h3 className="mb-3 text-base font-light uppercase tracking-[0.2em] text-white">
                Historial vacío
              </h3>
              <p className="text-sm font-light leading-relaxed text-slate-400">
                Cuando analices fotos del cielo nocturno, tus resultados aparecerán aquí automáticamente.
              </p>
            </div>
          </div>
        )}

        {!isLoading && entries.length > 0 && (
          <>
            <div className="mb-10 flex justify-end">
              <button
                type="button"
                onClick={handleClearAll}
                className={`
                  flex items-center gap-2 border border-white/10 px-4 py-2 text-xs font-light uppercase tracking-widest transition-all duration-300
                  ${showClearConfirm
                    ? 'border-red-400/50 text-red-300'
                    : 'text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white'
                  }
                `}
                aria-label={showClearConfirm ? 'Confirmar borrar todo' : 'Borrar todo el historial'}
              >
                <Trash2 size={14} strokeWidth={1} />
                <span>{showClearConfirm ? '¿Confirmar?' : 'Borrar todo'}</span>
              </button>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
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
      </main>

      <HistoryDetailModal
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
};

export default History;
