const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Orbital spinner */}
      <div className="relative w-16 h-16">
        {/* Center star */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-cosmic-gold rounded-full shadow-glow-gold animate-pulse" />
        </div>
        
        {/* Orbiting ring */}
        <div className="absolute inset-0 border-2 border-cosmic-blue/30 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-cosmic-blue rounded-full animate-spin-slow" />
        
        {/* Orbiting planet */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cosmic-blue rounded-full shadow-glow-blue" />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-foreground font-medium">Analizando el cosmos...</p>
        <p className="text-muted-foreground text-sm">
          🔭 Buscando constelaciones y estrellas
        </p>
      </div>
      
      {/* Progress shimmer */}
      <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
        <div className="w-full h-full animate-shimmer" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
