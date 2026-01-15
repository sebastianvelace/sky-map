import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const StarField = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const count = 80;
      
      for (let i = 0; i < count; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep space gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cosmic-navy/50 to-background" />
      
      {/* Nebula effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-blue/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cosmic-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-cosmic-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 1.5 
              ? `0 0 ${star.size * 3}px hsl(43 100% 90% / 0.6)` 
              : 'none',
          }}
        />
      ))}
      
      {/* Shooting star occasional */}
      <div className="absolute top-20 right-10 w-1 h-1 bg-cosmic-star rounded-full animate-float opacity-60" />
    </div>
  );
};

export default StarField;
