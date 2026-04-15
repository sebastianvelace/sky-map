import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author?: string;
}

const QUOTES: Quote[] = [
  { text: "El universo es un libro abierto esperando ser leído." },
  { text: "Mira las estrellas y encuentra tu propio camino." },
  { text: "En la inmensidad del cosmos, todos somos uno.", author: "Carl Sagan" },
  { text: "Las estrellas son las huellas de sueños antiguos." },
  { text: "El cielo nocturno nos recuerda lo pequeños y grandes que somos." },
  { text: "Cada estrella cuenta una historia eterna." },
  { text: "Explora lo desconocido, una constelación a la vez." },
  { text: "Somos polvo de estrellas contemplando las estrellas.", author: "Carl Sagan" },
];

const QuoteCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
        setIsVisible(true);
      }, 600);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = QUOTES[currentIndex];

  return (
    <div className="relative min-h-[4.5rem] flex items-center justify-center overflow-hidden">
      <div
        className={`w-full text-center transition-all duration-500 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2'
        }`}
      >
        <p className="text-slate-400 text-base sm:text-lg font-light italic leading-relaxed max-w-2xl mx-auto">
          "{currentQuote.text}"
        </p>
        {currentQuote.author && (
          <p className="text-slate-500 text-xs sm:text-sm mt-2 font-light tracking-wide">
            — {currentQuote.author}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuoteCarousel;
