import React, { useEffect, useState } from 'react';
import SuccessConfetti from './SuccessConfetti';
import CyberGlitchEffect from './CyberGlitchEffect';

interface VerificationCelebrationProps {
  active: boolean;
  artifactName?: string;
}

const VerificationCelebration: React.FC<VerificationCelebrationProps> = ({ 
  active, 
  artifactName = "Artefak"
}) => {
  const [showMainAnimation, setShowMainAnimation] = useState(false);
  const [showHologram, setShowHologram] = useState(false);
  
  useEffect(() => {
    if (active) {
      // Tunda munculnya animasi utama untuk efek bertahap
      setTimeout(() => setShowMainAnimation(true), 300);
      setTimeout(() => setShowHologram(true), 1200);
      
      // Reset animasi ketika tidak aktif lagi
      return () => {
        setShowMainAnimation(false);
        setShowHologram(false);
      };
    }
  }, [active]);
  
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background overlay dengan efek blur */}
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Efek confetti */}
      <SuccessConfetti active={active} />
      
      {/* Container animasi utama */}
      <div 
        className={`relative z-10 bg-background/80 border border-primary rounded-lg p-8 shadow-lg transition-all duration-500 transform
          ${showMainAnimation ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}
          shadow-[0_0_25px_rgba(0,229,255,0.5)]`}
      >
        {/* Lingkaran animasi cahaya */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary/30 rounded-full"
              style={{
                width: `${400 + i * 100}px`,
                height: `${400 + i * 100}px`,
                animation: `pulse-ring 2s ${i * 0.2}s ease-out infinite`,
                opacity: 0.2 + (i * 0.1)
              }}
            />
          ))}
        </div>
        
        {/* Icon/badge bersertifikat */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        
        {/* Teks dengan efek glitch */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold font-display mb-1 text-primary drop-shadow-glow">
            <CyberGlitchEffect text="VERIFIKASI SUKSES" active={active} />
          </h2>
          <p className="text-gray-200">
            {artifactName} telah diverifikasi dan tercatat di blockchain
          </p>
        </div>
        
        {/* Efek hologram digital */}
        {showHologram && (
          <div className="mt-6 pt-6 border-t border-primary/30 text-center relative flex justify-center">
            <div className="relative w-40 h-40">
              {/* Garis hologram horizontal */}
              {[...Array(10)].map((_, i) => (
                <div 
                  key={`h-${i}`}
                  className="absolute left-0 w-full h-px bg-primary/50"
                  style={{ 
                    top: `${i * 10}%`,
                    animation: `scan-line 4s infinite linear`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0.4
                  }}
                />
              ))}
              
              {/* Efek lingkaran hologram */}
              <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 border border-primary/50 rounded-full animate-pulse opacity-20"></div>
              
              {/* Icon verified */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-primary text-4xl font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationCelebration;
