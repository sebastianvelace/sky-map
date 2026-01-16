import { useEffect, useState, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const StarField = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stars only once with useMemo
  const stars = useMemo(() => {
    const newStars: Star[] = [];
    const count = 80;
    
    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    return newStars;
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,35%,4%)] via-[hsl(230,30%,6%)] to-[hsl(225,35%,3%)]" />
      
      {/* Subtle nebula glow effects */}
      <div 
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-nebula"
        style={{ background: 'radial-gradient(circle, hsl(270 50% 30% / 0.15) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] animate-nebula"
        style={{ 
          background: 'radial-gradient(circle, hsl(207 70% 40% / 0.1) 0%, transparent 70%)',
          animationDelay: '3s'
        }}
      />
      <div 
        className="absolute top-2/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[80px] animate-nebula"
        style={{ 
          background: 'radial-gradient(circle, hsl(45 60% 40% / 0.08) 0%, transparent 70%)',
          animationDelay: '5s'
        }}
      />
      
      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.size > 1.8 
              ? 'hsl(45 100% 90%)' 
              : star.size > 1.2 
                ? 'hsl(207 80% 85%)' 
                : 'hsl(220 30% 80%)',
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 1.5 
              ? `0 0 ${star.size * 4}px hsl(45 100% 90% / 0.6)` 
              : 'none',
          }}
        />
      ))}
      
      {/* Gradient overlay for depth at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[hsl(228,35%,3%)] to-transparent" />
    </div>
  );
};

export default StarField;