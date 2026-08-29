"use client";

export default function DividerWave() {
  return (
    <div className="relative w-full h-[80px] bg-slate-800 border-y-2 border-amber-400/40 overflow-hidden shadow-md flex items-center justify-center z-30">
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "radial-gradient(#93c5fd 1.5px, transparent 1.5px)", 
          backgroundSize: "18px 18px" 
        }} 
      />

      <svg className="relative z-10 w-full h-full" viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-left-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2"/>
            <stop offset="70%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#fbbf24"/>
          </linearGradient>
          <linearGradient id="grad-right-light" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2"/>
            <stop offset="70%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#fbbf24"/>
          </linearGradient>
        </defs>

        <g className="draw-wave-left">
          <path d="M -50 40 Q 150 5, 300 75 T 600 40" stroke="url(#grad-left-light)" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M -50 20 Q 150 65, 300 15 T 600 40" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="8 5" fill="none" opacity="0.85"/>
          <path d="M -50 60 Q 150 15, 300 65 T 600 40" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.7"/>
        </g>

        <g className="draw-wave-right">
          <path d="M 1250 40 Q 1050 75, 900 5 T 600 40" stroke="url(#grad-right-light)" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M 1250 20 Q 1050 15, 900 65 T 600 40" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="8 5" fill="none" opacity="0.85"/>
          <path d="M 1250 60 Q 1050 65, 900 15 T 600 40" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.7"/>
        </g>

        <g className="center-node">
          <circle cx="600" cy="40" r="14" fill="#fbbf24" opacity="0.25" />
          <circle cx="600" cy="40" r="7" fill="#fbbf24" />
          <circle cx="600" cy="40" r="3" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}