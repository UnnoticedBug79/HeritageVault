import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface VerificationCelebrationProps {
  active: boolean;
  artifactName?: string;
}

const VerificationCelebration: React.FC<VerificationCelebrationProps> = ({ active, artifactName }) => {
  const [showed, setShowed] = useState(false);
  
  useEffect(() => {
    if (active && !showed) {
      // Launch confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Lancurkan confetti dari kedua sisi
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#00f2ff', '#0033ff', '#ffffff']
        });
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#00f2ff', '#0033ff', '#ffffff']
        });
      }, 250);
      
      setShowed(true);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [active, showed]);
  
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="max-w-md bg-black/80 border border-primary/30 backdrop-blur-md p-6 rounded-xl text-center space-y-3 animate-bounce-slow">
        <h2 className="text-2xl font-display font-medium text-primary drop-shadow-glow">
          Verifikasi Berhasil!
        </h2>
        {artifactName && (
          <p className="text-white">
            Artefak "<span className="font-medium">{artifactName}</span>" telah terverifikasi 
            dan terdaftar di blockchain Internet Computer.
          </p>
        )}
        <div className="text-xs text-primary/80">Selamat! 🎉</div>
      </div>
    </div>
  );
};

export default VerificationCelebration;
