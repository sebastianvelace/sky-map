import { useState } from 'react';
import { Compass, Sparkles, Globe } from 'lucide-react';
import StarField from '@/components/StarField';
import ConstellationCard from '@/components/ConstellationCard';
import RegionSelector from '@/components/RegionSelector';
import { getConstellationsByRegion, Region, regionLabels } from '@/data/constellations';

const Gallery = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('equatorial');
  const constellations = getConstellationsByRegion(selectedRegion);

  return (
    <div className="min-h-screen relative overflow-x-hidden pt-20 pb-10">
      {/* Animated star background */}
      <StarField />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-5 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8 md:mb-10 animate-fade-in">
          {/* Icon */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div 
                className="absolute inset-0 blur-2xl rounded-full animate-pulse-glow"
                style={{ background: 'radial-gradient(circle, hsl(207 90% 70% / 0.3) 0%, transparent 70%)' }}
              />
              <div 
                className="relative p-4 rounded-2xl border border-cosmic-blue/30"
                style={{
                  background: 'linear-gradient(135deg, hsl(225 35% 12% / 0.8) 0%, hsl(225 35% 8% / 0.6) 100%)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <Globe className="w-8 h-8 md:w-10 md:h-10 text-cosmic-blue" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Galería de Constelaciones
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-8">
            Explora las constelaciones más impresionantes visibles desde cualquier lugar del mundo
          </p>

          {/* Region Selector */}
          <div className="max-w-2xl mx-auto">
            <RegionSelector 
              selectedRegion={selectedRegion} 
              onRegionChange={setSelectedRegion} 
            />
          </div>
        </header>

        {/* Region indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
          <Sparkles size={14} className="text-cosmic-gold" />
          <span className="text-sm text-cosmic-gold/80 font-medium">
            {constellations.length} constelaciones en {regionLabels[selectedRegion]}
          </span>
          <Sparkles size={14} className="text-cosmic-gold" />
        </div>

        {/* Constellation Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {constellations.map((constellation, index) => (
            <div 
              key={constellation.id}
              style={{ animationDelay: `${index * 0.08}s` }}
              className="animate-fade-in"
            >
              <ConstellationCard constellation={constellation} />
            </div>
          ))}
        </section>

        {/* Footer note */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/60">
            Toca cada constelación para descubrir su mitología y datos astronómicos fascinantes ✨
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Gallery;
