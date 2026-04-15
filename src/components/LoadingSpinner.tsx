const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-start gap-6 py-8">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border border-white/10 rounded-full" />
        <div className="absolute inset-0 animate-spin-orbit">
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/80 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
        </div>
        <div className="absolute inset-2 animate-spin-orbit" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-white font-light text-sm tracking-wide">Explorando el cosmos...</p>
        <p className="text-slate-500 text-[11px] font-light tracking-wider">
          Identificando estrellas y constelaciones
        </p>
      </div>

      <div className="w-32 h-px bg-slate-800 overflow-hidden">
        <div className="w-full h-full animate-shimmer" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
