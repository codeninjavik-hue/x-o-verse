import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const PeakClimberPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 300, H = 500;
    let x = W / 2, y = H - 30; let vy = 0; const G = 0.15;
    const platforms: { x: number; y: number; w: number; moving?: boolean; dx?: number }[] = [];
    for (let i = 0; i < 10; i++) platforms.push({ x: Math.random() * (W - 50), y: H - i * 50, w: 50, moving: Math.random() > 0.7, dx: (Math.random() - 0.5) * 2 });
    let cameraY = 0, s = 0;
    const keys = new Set<string>();

    const handler = (e: KeyboardEvent) => keys.add(e.key);
    const handlerUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener('keydown', handler); window.addEventListener('keyup', handlerUp);

    const loop = setInterval(() => {
      if (keys.has('ArrowLeft')) x -= 4;
      if (keys.has('ArrowRight')) x += 4;
      x = Math.max(0, Math.min(W, x));
      vy += G; y += vy;

      platforms.forEach(p => {
        if (p.moving && p.dx) { p.x += p.dx; if (p.x < 0 || p.x > W - p.w) p.dx = -p.dx; }
        if (vy > 0 && x > p.x && x < p.x + p.w && y > p.y - cameraY - 5 && y < p.y - cameraY + 8) vy = -8;
      });

      if (y < H / 3) { const shift = H / 3 - y; y = H / 3; cameraY -= shift; s += Math.floor(shift); setScore(s); }
      while (platforms[platforms.length - 1].y - cameraY > -20) platforms.push({ x: Math.random() * (W - 50), y: platforms[platforms.length - 1].y - 40 - Math.random() * 20, w: 50, moving: Math.random() > 0.5, dx: (Math.random() - 0.5) * 3 });

      if (y > H + 30) { setGameOver(true); clearInterval(loop); return; }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      // Mountain bg
      ctx.fillStyle = '#1a1a2e'; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W / 2, 50); ctx.lineTo(W, H); ctx.fill();
      platforms.forEach(p => { ctx.fillStyle = p.moving ? '#f97316' : '#a855f7'; ctx.fillRect(p.x, p.y - cameraY, p.w, 6); });
      ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); window.removeEventListener('keyup', handlerUp); };
  }, []);

  return (
    <GameLayout title="Peak Climber" onRestart={reset} accentColor="orange" rules="← → to move.\nBounce on platforms to climb higher.\nOrange platforms move!\nDon't fall!" score={<div className="text-sm">Height: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-orange mb-3 animate-scale-in">Fell! Height: {score}</div>}
      <canvas ref={canvasRef} width={300} height={500} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default PeakClimberPage;
