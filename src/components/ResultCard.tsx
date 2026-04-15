import { Sparkles } from 'lucide-react';
import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import TagExtractor from './TagExtractor';

interface ResultCardProps {
  result: string;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const formatResult = (text: string): React.ReactNode[] => {
    return text
      .split('\n')
      .map((line, index) => {
        const formatBold = (content: string): React.ReactNode => {
          const parts = content.split(/\*\*(.+?)\*\*/g);
          return parts.map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="text-white font-normal">{part}</strong>
            ) : (
              part
            )
          );
        };

        if (line.startsWith('###')) {
          return (
            <h3 key={index} className="text-base font-light text-white mt-5 mb-2 tracking-wide">
              {formatBold(line.replace(/^###\s*/, ''))}
            </h3>
          );
        }
        if (line.startsWith('##')) {
          return (
            <h2 key={index} className="text-lg font-light text-white mt-6 mb-3 tracking-wide">
              {formatBold(line.replace(/^##\s*/, ''))}
            </h2>
          );
        }
        if (line.startsWith('#')) {
          return (
            <h1 key={index} className="text-xl font-light text-white mt-5 mb-3 tracking-wide">
              {formatBold(line.replace(/^#\s*/, ''))}
            </h1>
          );
        }

        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          const content = line.replace(/^[•\-*]\s*/, '');
          return (
            <li key={index} className="flex items-start gap-3 my-2 leading-relaxed text-slate-300 font-light text-sm">
              <span className="text-slate-500 mt-0.5">—</span>
              <span>{formatBold(content)}</span>
            </li>
          );
        }

        if (/^\d+\./.test(line)) {
          const content = line.replace(/^\d+\.\s*/, '');
          const number = line.match(/^(\d+)\./)?.[1];
          return (
            <li key={index} className="flex items-start gap-3 my-2 leading-relaxed text-slate-300 font-light text-sm">
              <span className="text-slate-500 font-light min-w-[1.2rem]">{number}.</span>
              <span>{formatBold(content)}</span>
            </li>
          );
        }

        if (line.trim() === '') {
          return <div key={index} className="h-2" />;
        }

        return (
          <p key={index} className="text-slate-300 leading-relaxed my-3 font-light text-sm">
            {formatBold(line)}
          </p>
        );
      });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase">
            Análisis del Cielo
          </p>
        </div>
        <ConfidenceBadge result={result} />
      </div>

      <div className="mb-6">
        <TagExtractor result={result} />
      </div>

      <div className="max-w-2xl">
        {formatResult(result)}
      </div>
    </div>
  );
};

export default ResultCard;
