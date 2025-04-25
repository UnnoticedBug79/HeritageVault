import React from 'react';

interface SupportIconProps {
  className?: string;
}

const SupportIcon: React.FC<SupportIconProps> = ({ className }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Container utama */}
      <div className="w-full h-full relative flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Circle background */}
          <circle cx="50" cy="50" r="40" stroke="#00e5ff" strokeWidth="1" strokeDasharray="1 1" className="animate-pulse" />
          
          {/* Hands supporting symbol */}
          <path 
            d="M35 45C35 45 42 55 50 55C58 55 65 45 65 45" 
            stroke="#00e5ff" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          
          {/* Star/community symbol */}
          <path
            d="M50 30L53.5 40.5H64.5L55.5 47L59 57.5L50 51L41 57.5L44.5 47L35.5 40.5H46.5L50 30Z"
            stroke="#00e5ff"
            strokeWidth="1.5"
            fill="#00e5ff10"
          />
          
          {/* Connection lines representing community */}
          <path
            d="M30 60C30 60 40 70 50 70C60 70 70 60 70 60"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          
          {/* Artisan symbols */}
          <circle cx="30" cy="65" r="4" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff20" />
          <circle cx="50" cy="75" r="4" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff20" />
          <circle cx="70" cy="65" r="4" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff20" />
        </svg>
      </div>
      
      {/* Glowing effect */}
      <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" style={{ 
        background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(0,229,255,0) 70%)' 
      }}></div>
    </div>
  );
};

export default SupportIcon;
