import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useCosmosQA } from '@/hooks/useCosmosAPI';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CosmosQA = () => {
  const [question, setQuestion] = useState('');
  const { isLoading, currentAnswer, history, error, askQuestionAsync, clearError } = useCosmosQA();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    try {
      await askQuestionAsync(question.trim());
      setQuestion('');
    } catch {
      // Error state is handled by React Query mutation
    }
  };

  const formatAnswer = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-base font-light text-white mt-4 mb-2 tracking-wide">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-lg font-light text-white mt-4 mb-2 tracking-wide">{line.replace('# ', '')}</h2>;
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <p key={i} className="flex gap-3 text-slate-300 ml-1 my-1.5 font-light text-sm">
              <span className="text-slate-500">—</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[•-]\s/, '')) }} />
            </p>
          );
        }
        if (!line.trim()) return <br key={i} />;
        return <p key={i} className="text-slate-300 my-2 font-light text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
      });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-normal">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <section className="w-full">
      <p className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase mb-6">
        PREGUNTA AL COSMOS
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => {
              if (error) clearError();
              setQuestion(e.target.value);
            }}
            placeholder="¿Qué constelación es visible ahora?"
            className="flex-1 bg-transparent border-b border-slate-700/50 px-0 py-3 text-white text-sm font-light tracking-wide placeholder:text-slate-600 focus:outline-none focus:border-white/40 transition-colors duration-300"
            disabled={isLoading}
            aria-label="Tu pregunta sobre astronomía"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="text-slate-400 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Enviar pregunta"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-red-400/70 text-sm font-light">
          {error}
        </p>
      )}

      {currentAnswer && (
        <div className="mt-8 pl-4 border-l border-slate-700/40">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase">
              Respuesta
            </span>
          </div>
          <div className="max-w-2xl">
            {formatAnswer(currentAnswer)}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="history" className="border-slate-800/30">
              <AccordionTrigger className="text-[11px] text-slate-500 hover:text-slate-300 py-3 font-light tracking-widest uppercase">
                <div className="flex items-center gap-3">
                  <span>Historial</span>
                  <span className="text-slate-600">{history.length}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="pl-4 border-l border-slate-800/30">
                      <p className="text-sm font-light text-white mb-1.5">
                        {entry.question}
                      </p>
                      <p className="text-[13px] text-slate-400 font-light leading-relaxed line-clamp-3">
                        {entry.answer.slice(0, 200)}...
                      </p>
                      <p className="text-[10px] text-slate-600 mt-2 font-light tracking-wider">
                        {entry.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </section>
  );
};

export default CosmosQA;
