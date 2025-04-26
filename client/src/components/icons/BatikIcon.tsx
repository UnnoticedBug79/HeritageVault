import React from 'react';

interface BatikIconProps {
  className?: string;
}

const BatikIcon: React.FC<BatikIconProps> = ({ className }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 3V21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M4 7.5L20 16.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M20 7.5L4 16.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle 
        cx="8" 
        cy="10" 
        r="1" 
        fill="currentColor" 
      />
      <circle 
        cx="16" 
        cy="10" 
        r="1" 
        fill="currentColor" 
      />
      <circle 
        cx="8" 
        cy="14" 
        r="1" 
        fill="currentColor" 
      />
      <circle 
        cx="16" 
        cy="14" 
        r="1" 
        fill="currentColor" 
      />
    </svg>
  );
};

export default BatikIcon;
