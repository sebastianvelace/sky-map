import { useEffect, useState } from 'react';
import spaceBackground from '@/assets/space-background.jpg';

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
      const count = 60;
      
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
      {/* Real space background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${spaceBackground})` }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-background/70" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-navy/30 to-background/90" />
      
      {/* Subtle nebula glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-blue/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cosmic-purple/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Twinkling stars overlay */}
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
    </div>
  );
};

export default StarField;
