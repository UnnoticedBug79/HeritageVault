import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface SuccessConfettiProps {
  active?: boolean;
}

const SuccessConfetti: React.FC<SuccessConfettiProps> = ({ active = true }) => {
  useEffect(() => {
    if (!active) return;
    
    // Konfetti berwarna-warni dengan durasi lebih panjang
    const end = Date.now() + 3000;
    
    const colors = ['#02E7F5', '#05D5F3', '#00E1FF', '#00B8FF', '#ffffff'];
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, [active]);
  
  return null;
};

export default SuccessConfetti;
