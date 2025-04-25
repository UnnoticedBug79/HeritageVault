import React, { useEffect, useState } from 'react';

interface CyberGlitchEffectProps {
  text: string;
  active?: boolean;
}

const CyberGlitchEffect: React.FC<CyberGlitchEffectProps> = ({ text, active = true }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }

    // Karakter untuk efek glitch
    const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
    
    let iteration = 0;
    let interval: NodeJS.Timeout | null = null;
    
    const startGlitchEffect = () => {
      clearInterval(interval as NodeJS.Timeout);
      
      interval = setInterval(() => {
        // Buat text dengan efek glitch
        const newText = text
          .split('')
          .map((char, index) => {
            // Jika karakter sudah "terungkap" (iterasi melebihi indeks), tampilkan karakter asli
            if (index < iteration) {
              return char;
            }
            
            // Ganti karakter dengan karakter glitch acak
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('');
        
        setDisplayText(newText);
        
        // Selesaikan efek secara bertahap
        if (iteration >= text.length) {
          clearInterval(interval as NodeJS.Timeout);
        }
        
        iteration += 1/3;
      }, 30);
    };
    
    // Jalankan glitch effect beberapa kali untuk efek yang lebih dramatis
    let runCount = 0;
    const maxRuns = 3;
    
    const runGlitchSequence = () => {
      if (runCount >= maxRuns) return;
      
      startGlitchEffect();
      
      // Reset dan ulangi setelah jeda
      setTimeout(() => {
        iteration = 0;
        runCount++;
        runGlitchSequence();
      }, 1500);
    };
    
    runGlitchSequence();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, active]);

  return (
    <div className="cyber-glitch-container relative">
      <div className="cyber-glitch-text relative">
        {displayText}
        
        {/* Efek overlay glitch RGB split */}
        {active && (
          <>
            <div className="absolute top-0 left-0 w-full h-full text-red-500 opacity-50 mix-blend-screen" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, 0)' }}>
              {displayText}
            </div>
            <div className="absolute top-0 left-0 w-full h-full text-cyan-500 opacity-50 mix-blend-screen" style={{ clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)', transform: 'translate(2px, 0)' }}>
              {displayText}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CyberGlitchEffect;
