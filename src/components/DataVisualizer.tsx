import React from 'react';

export const DataVisualizer: React.FC = () => {
  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-background via-background to-red-500/5 rounded-lg overflow-hidden border border-red-500/20">
      {/* Background grid */}
      <div className="absolute inset-0 data-grid opacity-30"></div>
      
      {/* Matrix rain effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-red-500 to-transparent animate-matrix-rain"
            style={{
              left: `${12.5 * (i + 1)}%`,
              height: '20px',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Data nodes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Central hub */}
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse-glow shadow-lg shadow-red-500/50"></div>
          
          {/* Connecting lines and nodes */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = 60;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div key={i} className="absolute top-2 left-2">
                {/* Connection line */}
                <div
                  className="absolute w-px bg-gradient-to-r from-red-500/50 to-red-500/20 origin-left animate-data-pulse"
                  style={{
                    width: `${radius}px`,
                    transform: `rotate(${i * 60}deg)`,
                    transformOrigin: '0 0'
                  }}
                />
                
                {/* Data node */}
                <div
                  className="absolute w-2 h-2 bg-red-400 rounded-full animate-data-pulse"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Scanning overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-scan"></div>
      </div>

      {/* Data streams */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-end space-x-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-red-500/60 to-red-500/20 rounded-sm animate-data-pulse"
              style={{
                width: '8px',
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-red-400 font-mono">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};