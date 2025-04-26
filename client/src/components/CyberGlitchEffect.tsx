import React, { useEffect, useState } from 'react';

interface CyberGlitchEffectProps {
  text: string;
  active?: boolean;
}

const CyberGlitchEffect: React.FC<CyberGlitchEffectProps> = ({ text, active = true }) => {
  const [glitchText, setGlitchText] = useState(text);
  
  useEffect(() => {
    if (!active) return;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let glitchInterval: NodeJS.Timeout;
    
    // Start the glitch effect
    const startGlitch = () => {
      glitchInterval = setInterval(() => {
        // Randomly decide if we should glitch
        if (Math.random() < 0.2) {
          // Create a glitched version of the text
          const glitched = text.split('').map((char, index) => {
            // 20% chance to replace a character
            if (Math.random() < 0.2) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return char;
          }).join('');
          
          setGlitchText(glitched);
          
          // Reset back to original quickly
          setTimeout(() => {
            setGlitchText(text);
          }, 100);
        }
      }, 2000);
    };
    
    startGlitch();
    
    return () => {
      clearInterval(glitchInterval);
    };
  }, [text, active]);
  
  if (!active) return <span>{text}</span>;
  
  return (
    <span className="cyber-glitch-text">
      {glitchText}
      <span className="absolute left-0 top-0 text-primary opacity-70 glitch-anim" style={{ clipPath: 'inset(0 0 0 0)' }}>
        {glitchText}
      </span>
    </span>
  );
};

export default CyberGlitchEffect;
