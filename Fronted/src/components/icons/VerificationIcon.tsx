import React from 'react';

interface VerificationIconProps {
  className?: string;
}

const VerificationIcon: React.FC<VerificationIconProps> = ({ className }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Lingkaran luar dengan efek pulse */}
      <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse opacity-30"></div>
      <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-10"></div>
      
      {/* Container utama */}
      <div className="w-full h-full relative flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Lingkaran utama */}
          <circle cx="50" cy="50" r="42" stroke="#00e5ff" strokeWidth="2" strokeDasharray="6 3" className="animate-spin-slow"/>
          
          {/* Lingkaran dalam */}
          <circle cx="50" cy="50" r="30" stroke="#00e5ff" strokeWidth="1.5" />
          
          {/* Elemen hexagon */}
          <path 
            d="M50 20L70 35L70 65L50 80L30 65L30 35L50 20Z" 
            stroke="#00e5ff" 
            strokeWidth="1.5" 
            fill="#00e5ff10"
          />
          
          {/* Glowing center */}
          <circle cx="50" cy="50" r="10" fill="#00e5ff20" stroke="#00e5ff" strokeWidth="1.5" />
          
          {/* Simbol verifikasi (checkmark) */}
          <path 
            d="M40 50L47 57L60 43" 
            stroke="#00e5ff" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Garis-garis penghubung */}
          <line x1="50" y1="8" x2="50" y2="20" stroke="#00e5ff" strokeWidth="1" />
          <line x1="50" y1="80" x2="50" y2="92" stroke="#00e5ff" strokeWidth="1" />
          <line x1="8" y1="50" x2="20" y2="50" stroke="#00e5ff" strokeWidth="1" />
          <line x1="80" y1="50" x2="92" y2="50" stroke="#00e5ff" strokeWidth="1" />
          
          {/* Titik cahaya pulse pada beberapa posisi */}
          <circle cx="50" cy="8" r="3" fill="#00e5ff" className="animate-pulse" />
          <circle cx="92" cy="50" r="3" fill="#00e5ff" className="animate-pulse" />
          <circle cx="50" cy="92" r="3" fill="#00e5ff" className="animate-pulse" />
          <circle cx="8" cy="50" r="3" fill="#00e5ff" className="animate-pulse" />
        </svg>
      </div>
    </div>
  );
};

export default VerificationIcon;
