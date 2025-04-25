import React from 'react';

interface NFTIconProps {
  className?: string;
}

const NFTIcon: React.FC<NFTIconProps> = ({ className }) => {
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
          {/* Diamond shape */}
          <path 
            d="M50 15L75 35L75 65L50 85L25 65L25 35L50 15Z" 
            stroke="#00e5ff" 
            strokeWidth="1.5" 
            fill="url(#nft-gradient)"
          />
          
          {/* Inner pattern */}
          <path 
            d="M50 25L65 36L65 64L50 75L35 64L35 36L50 25Z" 
            stroke="#00e5ff" 
            strokeOpacity="0.6"
            strokeWidth="1" 
            strokeDasharray="4 2"
          />
          
          {/* NFT text */}
          <text x="37" y="55" className="text-lg font-bold" fill="#00e5ff">NFT</text>
          
          {/* Circle connections with pulse effect */}
          <circle cx="50" cy="15" r="2" fill="#00e5ff" className="animate-pulse" />
          <circle cx="75" cy="35" r="2" fill="#00e5ff" className="animate-pulse" />
          <circle cx="75" cy="65" r="2" fill="#00e5ff" className="animate-pulse" />
          <circle cx="50" cy="85" r="2" fill="#00e5ff" className="animate-pulse" />
          <circle cx="25" cy="65" r="2" fill="#00e5ff" className="animate-pulse" />
          <circle cx="25" cy="35" r="2" fill="#00e5ff" className="animate-pulse" />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="nft-gradient" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00e5ff" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#00e5ff" stopOpacity="0.1" />
              <stop offset="1" stopColor="#00e5ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Animated glowing ring */}
      <div className="absolute inset-0 border-2 border-primary rounded-full opacity-0 animate-ping"></div>
    </div>
  );
};

export default NFTIcon;
