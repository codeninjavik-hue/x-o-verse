import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  winner?: 'X' | 'O' | null;
}

const Confetti = ({ trigger, winner }: ConfettiProps) => {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;

      // Colors based on winner
      const colors = winner === 'X' 
        ? ['#00ffff', '#00cccc', '#00ffee'] // Cyan for X
        : ['#ff00aa', '#ff66cc', '#ff3399']; // Magenta for O

      // Fire confetti from both sides
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Left side
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors,
          zIndex: 9999,
        });

        // Right side
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors,
          zIndex: 9999,
        });
      }, 250);

      // Also fire the big initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors,
        zIndex: 9999,
      });

      return () => clearInterval(interval);
    }
  }, [trigger, winner]);

  useEffect(() => {
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger]);

  return null;
};

export default Confetti;
