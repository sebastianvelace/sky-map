import { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  twinkleScale: number;
}

const StarField = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 18, mass: 0.8 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 18, mass: 0.8 });

  const nebulaX = useTransform(smoothX, (value) => value * 28);
  const nebulaY = useTransform(smoothY, (value) => value * 24);
  const nebulaReverseX = useTransform(smoothX, (value) => value * -22);
  const nebulaReverseY = useTransform(smoothY, (value) => value * -19);
  const nebulaSoftX = useTransform(smoothX, (value) => value * 15);
  const nebulaSoftY = useTransform(smoothY, (value) => value * 13);
  const starsX = useTransform(smoothX, (value) => value * 14);
  const starsY = useTransform(smoothY, (value) => value * 12);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normalizedX = (event.clientX - centerX) / centerX;
      const normalizedY = (event.clientY - centerY) / centerY;

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

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
        twinkleScale: Math.random() * 0.45 + 1.05,
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
      <motion.div
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-nebula"
        style={{ x: nebulaX, y: nebulaY }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(270 50% 30% / 0.15) 0%, transparent 70%)' }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] animate-nebula"
        style={{
          x: nebulaReverseX,
          y: nebulaReverseY,
          animationDelay: '3s',
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(207 70% 40% / 0.1) 0%, transparent 70%)' }}
        />
      </motion.div>
      <motion.div
        className="absolute top-2/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[80px] animate-nebula"
        style={{
          x: nebulaSoftX,
          y: nebulaSoftY,
          animationDelay: '5s',
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(45 60% 40% / 0.08) 0%, transparent 70%)' }}
        />
      </motion.div>
      
      {/* Twinkling stars with parallax */}
      <motion.div className="absolute inset-0" style={{ x: starsX, y: starsY }}>
        {stars.map((star) => (
          <motion.div
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
              boxShadow: star.size > 1.5
                ? `0 0 ${star.size * 5}px hsl(45 100% 90% / 0.7)`
                : '0 0 2px hsl(220 40% 85% / 0.25)',
            }}
            initial={{ opacity: star.opacity, scale: 1 }}
            animate={{
              opacity: [star.opacity, Math.min(1, star.opacity + 0.35), star.opacity * 0.65, star.opacity],
              scale: [1, star.twinkleScale, 0.92, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
      
      {/* Gradient overlay for depth at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[hsl(228,35%,3%)] to-transparent" />
    </div>
  );
};

export default StarField;