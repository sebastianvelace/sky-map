const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in">
      {/* Elegant orbital spinner */}
      <div className="relative w-20 h-20">
        {/* Outer orbit ring */}
        <div className="absolute inset-0 border-2 border-cosmic-blue/20 rounded-full" />
        
        {/* Spinning orbit */}
        <div className="absolute inset-0 animate-spin-orbit">
          <div 
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(207 90% 70%) 0%, hsl(207 90% 50%) 100%)',
              boxShadow: '0 0 12px hsl(207 90% 70% / 0.6)'
            }}
          />
        </div>
        
        {/* Second orbit - slower */}
        <div className="absolute inset-2 animate-spin-orbit" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div 
            className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(45 100% 65%) 0%, hsl(45 100% 55%) 100%)',
              boxShadow: '0 0 8px hsl(45 100% 55% / 0.5)'
            }}
          />
        </div>
        
        {/* Center star */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-4 h-4 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, hsl(45 100% 90%) 0%, hsl(45 100% 60%) 100%)',
              boxShadow: '0 0 20px hsl(45 100% 60% / 0.5)'
            }}
          />
        </div>
      </div>
      
      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-foreground font-medium text-lg">Explorando el cosmos...</p>
        <p className="text-muted-foreground text-sm">
          ✨ Identificando estrellas y constelaciones
        </p>
      </div>
      
      {/* Progress shimmer bar */}
      <div className="w-48 h-1 bg-secondary/50 rounded-full overflow-hidden">
        <div className="w-full h-full animate-shimmer" />
      </div>
    </div>
  );
};

export default LoadingSpinner;