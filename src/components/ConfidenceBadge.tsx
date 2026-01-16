import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface ConfidenceBadgeProps {
  result: string;
}

type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

function analyzeConfidence(text: string): ConfidenceLevel {
  const lowConfidenceWords = [
    'no puedo', 'no logro', 'difícil', 'posiblemente', 'quizás', 'tal vez',
    'no estoy seguro', 'parece ser', 'podría ser', 'no se aprecia', 'borroso',
    'oscuro', 'sin estrellas', 'nublado', 'contaminación lumínica'
  ];
  
  const highConfidenceWords = [
    'claramente', 'definitivamente', 'sin duda', 'identifico', 'reconozco',
    'perfectamente visible', 'brillante', 'destacada', 'inconfundible',
    'fácilmente', 'cielo despejado'
  ];

  const lowerText = text.toLowerCase();
  
  let score = 50; // Base score

  // Check for high confidence indicators
  highConfidenceWords.forEach(word => {
    if (lowerText.includes(word)) score += 10;
  });

  // Check for low confidence indicators
  lowConfidenceWords.forEach(word => {
    if (lowerText.includes(word)) score -= 15;
  });

  // Check for number of identified objects (more = higher confidence)
  const starMatches = lowerText.match(/\*\*[^*]+\*\*/g);
  if (starMatches) {
    score += Math.min(starMatches.length * 5, 20);
  }

  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'low';
  return 'unknown';
}

const confidenceConfig = {
  high: {
    icon: ShieldCheck,
    label: 'Alta confianza',
    color: 'hsl(142 76% 45%)',
    bgColor: 'hsl(142 76% 45% / 0.15)',
  },
  medium: {
    icon: Shield,
    label: 'Confianza media',
    color: 'hsl(48 96% 53%)',
    bgColor: 'hsl(48 96% 53% / 0.15)',
  },
  low: {
    icon: ShieldAlert,
    label: 'Baja confianza',
    color: 'hsl(0 72% 55%)',
    bgColor: 'hsl(0 72% 55% / 0.15)',
  },
  unknown: {
    icon: ShieldQuestion,
    label: 'Sin determinar',
    color: 'hsl(220 15% 55%)',
    bgColor: 'hsl(220 15% 55% / 0.15)',
  },
};

const ConfidenceBadge = ({ result }: ConfidenceBadgeProps) => {
  const confidence = analyzeConfidence(result);
  const config = confidenceConfig[confidence];
  const Icon = config.icon;

  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{ 
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}40`
      }}
    >
      <Icon size={14} />
      <span>{config.label}</span>
    </div>
  );
};

export default ConfidenceBadge;
