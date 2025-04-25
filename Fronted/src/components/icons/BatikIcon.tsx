import React from 'react';

interface BatikIconProps {
  className?: string;
}

const BatikIcon: React.FC<BatikIconProps> = ({ className }) => {
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
          {/* Outer circle */}
          <circle cx="50" cy="50" r="40" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 2" className="animate-spin-slow"/>
          
          {/* Batik pattern frame */}
          <rect x="30" y="30" width="40" height="40" rx="2" stroke="#00e5ff" strokeWidth="1.5" />
          
          {/* Stylized batik pattern */}
          <path 
            d="M30 40H70M30 50H70M30 60H70M40 30V70M50 30V70M60 30V70" 
            stroke="#00e5ff" 
            strokeWidth="0.5" 
            strokeOpacity="0.6"
          />
          
          {/* Kawung pattern elements */}
          <circle cx="40" cy="40" r="5" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff10" />
          <circle cx="60" cy="40" r="5" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff10" />
          <circle cx="40" cy="60" r="5" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff10" />
          <circle cx="60" cy="60" r="5" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff10" />
          
          {/* Parang pattern elements */}
          <path
            d="M35 45L45 55M55 45L65 55M35 55L45 45M55 55L65 45"
            stroke="#00e5ff"
            strokeWidth="0.5"
            strokeOpacity="0.8"
          />
          
          {/* Central flower pattern */}
          <circle cx="50" cy="50" r="6" stroke="#00e5ff" strokeWidth="1" fill="#00e5ff10" className="animate-pulse" />
          <path
            d="M50 44L50 56M44 50H56M47 47L53 53M47 53L53 47"
            stroke="#00e5ff"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      
      {/* Glowing effect */}
      <div className="absolute inset-0 rounded-full opacity-20" style={{ 
        background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, rgba(0,229,255,0) 70%)' 
      }}></div>
    </div>
  );
};

export default BatikIcon;
