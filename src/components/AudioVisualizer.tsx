import React from 'react';

interface AudioVisualizerProps {
  bars?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  bars = 16,
  className = '',
  size = 'md',
}) => {
  const heightClass = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-16' : 'h-10';

  return (
    <div className={`flex items-end justify-center gap-[3px] sm:gap-1.5 ${heightClass} ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        // Pseudo-random staggered delays and heights
        const delay = (i % 6) * 0.15;
        const duration = 0.8 + ((i * 13) % 7) * 0.1;
        return (
          <div
            key={i}
            className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-blue-700 via-sky-400 to-amber-300 opacity-90 transition-all shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            style={{
              animation: `soundWave ${duration}s infinite ease-in-out alternate`,
              animationDelay: `${delay}s`,
              height: '40%',
            }}
          />
        );
      })}
      <style>{`
        @keyframes soundWave {
          0% { height: 15%; opacity: 0.4; }
          50% { height: 85%; opacity: 0.9; }
          100% { height: 35%; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};
