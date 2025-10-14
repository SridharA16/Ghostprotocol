import React from 'react';
import { cn } from '@/lib/utils';

interface MilitaryLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MilitaryLogo: React.FC<MilitaryLogoProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn(
      'relative',
      sizeClasses[size],
      'animate-float',
      className
    )}>
      {/* Outer tactical ring */}
      <div className="absolute inset-0 border-2 border-red-500/30 rounded-lg animate-spin-slow">
        <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-red-500"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-r-2 border-t-2 border-red-500"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-l-2 border-b-2 border-red-500"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-red-500"></div>
      </div>

      {/* Main logo container */}
      <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg animate-pulse-glow">
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent animate-scan"></div>
        </div>

        {/* Flicker overlay */}
        <div className="absolute inset-0 bg-red-400/20 rounded-lg animate-flicker"></div>

        {/* Shield and star SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield outline */}
          <path
            d="M50 10 L25 25 L25 60 Q25 75 50 85 Q75 75 75 60 L75 25 Z"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            fill="rgba(255, 255, 255, 0.1)"
          />
          
          {/* Inner shield fill */}
          <path
            d="M50 15 L30 27 L30 58 Q30 70 50 78 Q70 70 70 58 L70 27 Z"
            fill="rgba(255, 255, 255, 0.2)"
          />
          
          {/* Central star */}
          <path
            d="M50 35 L52 42 L60 42 L54 47 L56 55 L50 50 L44 55 L46 47 L40 42 L48 42 Z"
            fill="hsl(var(--foreground))"
            className="drop-shadow-glow"
          />
          
          {/* Tactical lines */}
          <line x1="35" y1="65" x2="65" y2="65" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.7" />
          <line x1="38" y1="70" x2="62" y2="70" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white/60"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-white/60"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-white/60"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/60"></div>
      </div>
    </div>
  );
};