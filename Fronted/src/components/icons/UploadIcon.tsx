import React from 'react';

interface UploadIconProps {
  className?: string;
}

const UploadIcon: React.FC<UploadIconProps> = ({ className }) => {
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
          {/* Lingkaran utama */}
          <circle cx="50" cy="50" r="40" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4 2" className="animate-pulse"/>
          
          {/* Hexagon */}
          <path 
            d="M50 20L75 35L75 65L50 80L25 65L25 35L50 20Z" 
            stroke="#00e5ff" 
            strokeWidth="1.5" 
            fill="#00e5ff10"
          />
          
          {/* Upload symbol */}
          <path 
            d="M50 33V60M50 33L40 43M50 33L60 43" 
            stroke="#00e5ff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          <path
            d="M35 65H65"
            stroke="#00e5ff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Glowing points */}
          <circle cx="50" cy="33" r="2" fill="#00e5ff" className="animate-pulse" />
          <circle cx="50" cy="65" r="2" fill="#00e5ff" className="animate-pulse" />
        </svg>
      </div>
      
      {/* Glowing effect */}
      <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" style={{ 
        background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, rgba(0,229,255,0) 70%)' 
      }}></div>
    </div>
  );
};

export default UploadIcon;
