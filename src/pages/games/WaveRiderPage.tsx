import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const WaveRiderPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const posRef = useRef(200);
  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 400, H = 300; let t = 0, s = 0;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') posRef.current = Math.max(20, posRef.current - 10);
      if (e.key === 'ArrowDown') posRef.current = Math.min(H - 20, posRef.current + 10);
    };
    window.addEventListener('keydown', handler);

    const loop = setInterval(() => {
      t += 0.03; s++; if (s % 10 === 0) setScore(Math.floor(s / 10));
      const waveY = (x: number) => H / 2 + Math.sin(x * 0.02 + t) * 50 + Math.sin(x * 0.05 + t * 2) * 20;

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      // Draw wave
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 2) { ctx.lineTo(x, waveY(x)); }
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = '#00ffff11'; ctx.fill();
      ctx.strokeStyle = '#00ffff44'; ctx.stroke();

      // Surfer
      const surfY = posRef.current;
      ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(60, surfY, 8, 0, Math.PI * 2); ctx.fill();

      // Check collision with wave
      const waveAtSurfer = waveY(60);
      if (Math.abs(surfY - waveAtSurfer) < 5) { s += 5; }
      if (surfY > waveAtSurfer + 30) { setGameOver(true); clearInterval(loop); }
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, []);

  return (
    <GameLayout title="Wave Rider" onRestart={reset} accentColor="green" rules="↑ ↓ to surf the neon waves.\nStay close to the wave for bonus points.\nDon't fall too far below!" score={<div className="text-sm">Score: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-green mb-3 animate-scale-in">Wiped Out! Score: {score}</div>}
      <canvas ref={canvasRef} width={400} height={300} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default WaveRiderPage;
