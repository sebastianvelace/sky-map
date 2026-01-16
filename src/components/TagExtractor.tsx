const TAG_COLORS: Record<string, string> = {
  // Constellations
  'orión': '#4a9eff',
  'orion': '#4a9eff',
  'escorpio': '#ff6b6b',
  'scorpius': '#ff6b6b',
  'cruz del sur': '#ffffff',
  'crux': '#ffffff',
  'centauro': '#9b59b6',
  'centaurus': '#9b59b6',
  'osa mayor': '#3498db',
  'osa menor': '#3498db',
  'casiopea': '#e91e63',
  'leo': '#f39c12',
  'virgo': '#1abc9c',
  'géminis': '#00bcd4',
  'tauro': '#ff5722',
  'sagitario': '#673ab7',
  
  // Stars
  'sirio': '#a8d8ff',
  'antares': '#ff4444',
  'alfa centauri': '#ffd700',
  'alpha centauri': '#ffd700',
  'betelgeuse': '#ff6600',
  'rigel': '#87ceeb',
  'vega': '#add8e6',
  'arturo': '#ffa500',
  'canopo': '#fffacd',
  'polaris': '#f0f8ff',
  
  // Objects
  'nebulosa': '#ff69b4',
  'galaxia': '#9370db',
  'cúmulo': '#20b2aa',
  'planeta': '#32cd32',
  'luna': '#f5f5dc',
  'vía láctea': '#e6e6fa',
};

interface TagExtractorProps {
  result: string;
}

const TagExtractor = ({ result }: TagExtractorProps) => {
  // Extract bold text patterns
  const boldMatches = result.match(/\*\*([^*]+)\*\*/g) || [];
  const names = boldMatches.map(m => m.replace(/\*\*/g, '').toLowerCase());
  
  // Find matching tags
  const matchedTags: { name: string; color: string }[] = [];
  const seen = new Set<string>();
  
  names.forEach(name => {
    const lowerName = name.toLowerCase();
    for (const [key, color] of Object.entries(TAG_COLORS)) {
      if (lowerName.includes(key) && !seen.has(key)) {
        seen.add(key);
        matchedTags.push({ 
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          color 
        });
        break;
      }
    }
  });

  // Also check for unbolded mentions
  const lowerResult = result.toLowerCase();
  for (const [key, color] of Object.entries(TAG_COLORS)) {
    if (lowerResult.includes(key) && !seen.has(key)) {
      seen.add(key);
      matchedTags.push({ 
        name: key.charAt(0).toUpperCase() + key.slice(1), 
        color 
      });
    }
  }

  if (matchedTags.length === 0) return null;

  // Limit to top 6 tags
  const displayTags = matchedTags.slice(0, 6);

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-transform hover:scale-105"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            border: `1px solid ${tag.color}40`,
            textShadow: `0 0 10px ${tag.color}40`
          }}
        >
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagExtractor;
