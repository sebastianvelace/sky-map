import { Globe, MapPin } from 'lucide-react';
import { Region, regionLabels } from '@/data/constellations';

interface RegionSelectorProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: { id: Region; icon: string; description: string }[] = [
  { id: 'north', icon: '🌍', description: 'Latitudes norte (>23.5°N)' },
  { id: 'equatorial', icon: '🌎', description: 'Zona ecuatorial (±23.5°)' },
  { id: 'south', icon: '🌏', description: 'Latitudes sur (<23.5°S)' },
];

const RegionSelector = ({ selectedRegion, onRegionChange }: RegionSelectorProps) => {
  return (
    <div className="w-full">
      {/* Pills container with horizontal scroll on mobile */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {regions.map((region) => {
          const isSelected = selectedRegion === region.id;
          
          return (
            <button
              key={region.id}
              onClick={() => onRegionChange(region.id)}
              className={`
                relative flex-shrink-0 snap-center
                flex items-center gap-2 px-4 py-3 md:px-5 md:py-3
                rounded-full font-medium text-sm md:text-base
                transition-all duration-500 ease-out
                ${isSelected 
                  ? 'bg-gradient-to-r from-cosmic-blue to-cosmic-purple text-white shadow-glow-blue scale-105' 
                  : 'glass-card text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-border/30'
                }
              `}
              aria-label={`Seleccionar ${regionLabels[region.id]}`}
              aria-pressed={isSelected}
            >
              <span className="text-lg">{region.icon}</span>
              <span className="whitespace-nowrap">{regionLabels[region.id]}</span>
              
              {/* Selection indicator */}
              {isSelected && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cosmic-gold rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Description text */}
      <p className="mt-3 text-xs text-muted-foreground/70 text-center animate-fade-in">
        {regions.find(r => r.id === selectedRegion)?.description}
      </p>
    </div>
  );
};

export default RegionSelector;
