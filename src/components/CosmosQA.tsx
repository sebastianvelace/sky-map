import { useState } from 'react';
import { Send, Sparkles, ChevronDown, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface QAEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

const CosmosQA = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [history, setHistory] = useState<QAEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setCurrentAnswer(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('cosmos-qa', {
        body: { question: question.trim() }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Error al conectar con el servidor');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.answer) {
        setCurrentAnswer(data.answer);
        
        // Add to history (keep last 5)
        const newEntry: QAEntry = {
          id: Date.now().toString(),
          question: question.trim(),
          answer: data.answer,
          timestamp: new Date(),
        };
        
        setHistory(prev => [newEntry, ...prev].slice(0, 5));
        setQuestion('');
      } else {
        throw new Error('No se pudo obtener respuesta. Intenta reformular tu pregunta.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAnswer = (text: string) => {
    // Simple markdown-like formatting
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('## ')) {
          return <h3 key={i} className="text-lg font-display font-semibold text-cosmic-gold mt-4 mb-2">{line.replace('## ', '')}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={i} className="text-xl font-display font-bold text-cosmic-gold mt-4 mb-2">{line.replace('# ', '')}</h2>;
        }
        // Bullets
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <p key={i} className="flex gap-2 text-muted-foreground ml-2 my-1">
              <span className="text-cosmic-gold">★</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[•-]\s/, '')) }} />
            </p>
          );
        }
        // Empty lines
        if (!line.trim()) return <br key={i} />;
        // Regular paragraphs
        return <p key={i} className="text-muted-foreground my-2" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
      });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <section className="w-full mt-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-cosmic-purple/20 border border-cosmic-purple/30">
          <MessageCircle className="w-5 h-5 text-cosmic-purple" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">Pregunta al Cosmos</h2>
          <p className="text-xs text-muted-foreground">Consulta cualquier duda sobre astronomía</p>
        </div>
      </div>

      {/* Input Card */}
      <div className="glass-card rounded-2xl p-5 border border-cosmic-purple/20 relative overflow-hidden">
        {/* Glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(260 80% 60%) 0%, transparent 70%)' }}
        />
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej: ¿Qué constelación es visible ahora en mi región?"
              className="flex-1 bg-secondary/50 border border-border/30 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple/50 transition-all"
              disabled={isLoading}
              aria-label="Tu pregunta sobre astronomía"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white shadow-glow-purple hover:shadow-[0_0_30px_hsl(260_80%_60%_/_0.5)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Enviar pregunta"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Current Answer */}
        {currentAnswer && (
          <div className="mt-6 p-5 rounded-xl bg-secondary/30 border border-border/30 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cosmic-gold" />
              <span className="text-xs font-medium text-cosmic-gold">Respuesta del Cosmos</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              {formatAnswer(currentAnswer)}
            </div>
          </div>
        )}
      </div>

      {/* History Accordion */}
      {history.length > 0 && (
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="history" className="border-border/30">
              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-3">
                <div className="flex items-center gap-2">
                  <span>Historial de preguntas</span>
                  <span className="px-2 py-0.5 rounded-full bg-cosmic-purple/20 text-cosmic-purple text-xs">
                    {history.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {history.map((entry) => (
                    <div 
                      key={entry.id}
                      className="p-4 rounded-xl bg-secondary/20 border border-border/20"
                    >
                      <p className="text-sm font-medium text-foreground mb-2">
                        💭 {entry.question}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {entry.answer.slice(0, 200)}...
                      </p>
                      <p className="text-xs text-muted-foreground/50 mt-2">
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
