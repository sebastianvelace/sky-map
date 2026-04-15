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
      <p className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase mb-6">
        CONOS
      </p>
      <div className="space-y-1">
        {regions.map((region) => {
          const isSelected = selectedRegion === region.id;

          return (
            <button
              key={region.id}
              onClick={() => onRegionChange(region.id)}
              className={`
                w-full text-left py-2.5 px-1
                text-sm font-light text-slate-300
                transition-all duration-300
                ${isSelected
                  ? 'text-white translate-x-2'
                  : 'hover:text-white hover:translate-x-2'
                }
              `}
              aria-label={`Seleccionar ${regionLabels[region.id]}`}
              aria-pressed={isSelected}
            >
              {regionLabels[region.id]}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] text-slate-500/70 font-light tracking-wide">
        {regions.find(r => r.id === selectedRegion)?.description}
      </p>
    </div>
  );
};

export default RegionSelector;
