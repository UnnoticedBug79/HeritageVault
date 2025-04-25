import React, { useEffect, useState } from 'react';

interface SuccessConfettiProps {
  active?: boolean;
}

const SuccessConfetti: React.FC<SuccessConfettiProps> = ({ active = true }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
    xVelocity: number;
    yVelocity: number;
    rotationVelocity: number;
  }>>([]);

  useEffect(() => {
    if (!active) return;

    // Buat confetti particles
    const newParticles = Array.from({ length: 100 }, (_, i) => {
      const colors = ['#00e5ff', '#33ff99', '#ffcc00', '#ff66cc', '#cc99ff'];
      
      return {
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100, // Mulai dari atas layar
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        xVelocity: (Math.random() - 0.5) * 5,
        yVelocity: 2 + Math.random() * 5,
        rotationVelocity: (Math.random() - 0.5) * 10
      };
    });
    
    setParticles(newParticles);
    
    // Animasi jatuhnya confetti
    const animationFrame = requestAnimationFrame(function animate() {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update posisi dan rotasi
          const updatedParticle = {
            ...particle,
            y: particle.y + particle.yVelocity,
            x: particle.x + particle.xVelocity,
            rotation: (particle.rotation + particle.rotationVelocity) % 360
          };
          
          // Reset jika particle sudah mencapai bawah layar
          if (updatedParticle.y > window.innerHeight) {
            updatedParticle.y = -20;
            updatedParticle.x = Math.random() * window.innerWidth;
          }
          
          return updatedParticle;
        })
      );
      
      // Berhenti setelah 5 detik
      if (active) {
        requestAnimationFrame(animate);
      }
    });

    // Bersihkan animasi ketika komponen di-unmount atau active berubah
    return () => {
      cancelAnimationFrame(animationFrame);
      setParticles([]);
    };
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.8,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%', // Buat beberapa bulat, beberapa kotak
            boxShadow: `0 0 5px ${particle.color}`
          }}
        />
      ))}
    </div>
  );
};

export default SuccessConfetti;
