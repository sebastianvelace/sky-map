import { Sparkles } from 'lucide-react';

interface ResultCardProps {
  result: string;
}

const ResultCard = ({ result }: ResultCardProps) => {
  // Simple markdown-like formatting
  const formatResult = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('###')) {
          return (
            <h3 key={index} className="text-lg font-bold text-cosmic-gold mt-4 mb-2 flex items-center gap-2">
              {line.replace(/^###\s*/, '')}
            </h3>
          );
        }
        if (line.startsWith('##')) {
          return (
            <h2 key={index} className="text-xl font-bold text-cosmic-gold mt-5 mb-2">
              {line.replace(/^##\s*/, '')}
            </h2>
          );
        }
        if (line.startsWith('#')) {
          return (
            <h1 key={index} className="text-2xl font-bold text-cosmic-gold mt-4 mb-3">
              {line.replace(/^#\s*/, '')}
            </h1>
          );
        }
        
        // Bullet points
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          return (
            <li key={index} className="ml-4 text-foreground/90 leading-relaxed list-none flex items-start gap-2 my-1">
              <span className="text-cosmic-blue mt-1">✦</span>
              <span>{line.replace(/^[•\-*]\s*/, '')}</span>
            </li>
          );
        }
        
        // Numbered lists
        if (/^\d+\./.test(line)) {
          return (
            <li key={index} className="ml-4 text-foreground/90 leading-relaxed list-decimal my-1">
              {line.replace(/^\d+\.\s*/, '')}
            </li>
          );
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="text-foreground/90 leading-relaxed my-2">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 md:p-6 shadow-cosmic">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
        <Sparkles className="w-5 h-5 text-cosmic-gold" />
        <h3 className="font-display font-bold text-foreground">Resultados del Análisis</h3>
      </div>
      
      {/* Content */}
      <div className="result-content text-sm md:text-base">
        {formatResult(result)}
      </div>
    </div>
  );
};

export default ResultCard;
