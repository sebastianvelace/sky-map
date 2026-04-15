import { useState } from 'react';
import { Star, Info, MapPin, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import ConstellationModal from './ConstellationModal';

export interface ConstellationData {
  id: string;
  name: string;
  latinName: string;
  imageUrl: string;
  fallbackUrl: string;
  color: string;
  visibility: string;
  bestTime: string;
  direction: string;
  brightness: string;
  mythology: string;
  funFacts: string[];
}

interface ConstellationCardProps {
  constellation: ConstellationData;
}

const ConstellationCard = ({ constellation }: ConstellationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSrc = imageError ? constellation.fallbackUrl : constellation.imageUrl;

  return (
    <>
      <motion.div
        className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/15 bg-white/[0.045] backdrop-blur-xl shadow-[0_14px_44px_hsl(222_45%_4%_/_0.45)] transition-colors duration-500 hover:border-cosmic-blue/40"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{
          y: -8,
          scale: 1.02,
          boxShadow: '0 18px 56px hsl(217 80% 55% / 0.22), 0 0 30px hsl(204 90% 65% / 0.2)',
        }}
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalles de ${constellation.name}`}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/12 via-transparent to-cosmic-blue/10 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Image container with lazy loading */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageSrc}
            alt={`Constelación de ${constellation.name} (${constellation.latinName})`}
            className={`
              w-full h-full object-cover transition-all duration-700
              group-hover:scale-110 group-hover:brightness-110
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (!imageError) setImageError(true);
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-transparent opacity-85" />
          
          {/* Floating info icon */}
          <div className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Info size={16} className="text-cosmic-gold" />
          </div>
          
          {/* Color accent tag */}
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{ 
              backgroundColor: `${constellation.color}20`,
              color: constellation.color,
              border: `1px solid ${constellation.color}40`
            }}
          >
            {constellation.latinName}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 space-y-4">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-cosmic-gold transition-colors">
              {constellation.name}
            </h3>
            <Star size={18} className="text-cosmic-gold animate-pulse-gold" />
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-cosmic-blue" />
              <span>{constellation.visibility}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-cosmic-gold" />
              <span>{constellation.bestTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-cosmic-purple" />
              <span>{constellation.direction}</span>
            </div>
          </div>

          {/* Brightness indicator */}
          <div className="pt-2 border-t border-border/30">
            <span className="text-xs text-muted-foreground">Brillo: </span>
            <span className="text-xs font-medium text-cosmic-gold">{constellation.brightness}</span>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <ConstellationModal 
        constellation={constellation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ConstellationCard;
