import { Sparkles } from 'lucide-react';
import React from 'react';

interface ResultCardProps {
  result: string;
}

const ResultCard = ({ result }: ResultCardProps) => {
  // Enhanced markdown-like formatting with proper bullet styling
  const formatResult = (text: string): React.ReactNode[] => {
    return text
      .split('\n')
      .map((line, index) => {
        // Bold text formatting
        const formatBold = (content: string): React.ReactNode => {
          const parts = content.split(/\*\*(.+?)\*\*/g);
          return parts.map((part, i) => 
            i % 2 === 1 ? (
              <strong key={i} className="text-cosmic-gold font-semibold">{part}</strong>
            ) : (
              part
            )
          );
        };

        // Headers
        if (line.startsWith('###')) {
          return (
            <h3 key={index} className="font-display text-lg font-semibold text-cosmic-gold mt-5 mb-2">
              {formatBold(line.replace(/^###\s*/, ''))}
            </h3>
          );
        }
        if (line.startsWith('##')) {
          return (
            <h2 key={index} className="font-display text-xl font-semibold text-cosmic-gold mt-6 mb-3">
              {formatBold(line.replace(/^##\s*/, ''))}
            </h2>
          );
        }
        if (line.startsWith('#')) {
          return (
            <h1 key={index} className="font-display text-2xl font-bold text-cosmic-gold mt-5 mb-3">
              {formatBold(line.replace(/^#\s*/, ''))}
            </h1>
          );
        }
        
        // Bullet points - convert dashes to beautiful bullets
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          const content = line.replace(/^[•\-*]\s*/, '');
          return (
            <li key={index} className="flex items-start gap-3 my-2 leading-relaxed text-cosmic-text">
              <span className="text-cosmic-gold mt-0.5 text-sm">★</span>
              <span>{formatBold(content)}</span>
            </li>
          );
        }
        
        // Numbered lists
        if (/^\d+\./.test(line)) {
          const content = line.replace(/^\d+\.\s*/, '');
          const number = line.match(/^(\d+)\./)?.[1];
          return (
            <li key={index} className="flex items-start gap-3 my-2 leading-relaxed text-cosmic-text">
              <span className="text-cosmic-blue font-medium min-w-[1.5rem]">{number}.</span>
              <span>{formatBold(content)}</span>
            </li>
          );
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="text-cosmic-text leading-relaxed my-3">
            {formatBold(line)}
          </p>
        );
      });
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-card animate-fade-in-scale">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
        <div 
          className="p-2 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, hsl(45 100% 55% / 0.2) 0%, hsl(45 100% 55% / 0.1) 100%)'
          }}
        >
          <Sparkles className="w-5 h-5 text-cosmic-gold" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          Análisis del Cielo
        </h3>
      </div>
      
      {/* Content */}
      <div className="result-content">
        {formatResult(result)}
      </div>
    </div>
  );
};

export default ResultCard;