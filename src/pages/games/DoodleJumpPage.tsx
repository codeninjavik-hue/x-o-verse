import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const DoodleJumpPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 300, H = 500;
    let x = W / 2, y = H - 50, vy = -10;
    const platforms: { x: number; y: number; w: number }[] = [];
    for (let i = 0; i < 8; i++) platforms.push({ x: Math.random() * (W - 60), y: H - i * 65, w: 60 });
    let cameraY = 0, s = 0;
    const keys = new Set<string>();

    const handler = (e: KeyboardEvent) => keys.add(e.key);
    const handlerUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener('keydown', handler); window.addEventListener('keyup', handlerUp);

    const loop = setInterval(() => {
      if (keys.has('ArrowLeft')) x -= 5;
      if (keys.has('ArrowRight')) x += 5;
      x = (x + W) % W;
      vy += 0.3; y += vy;

      platforms.forEach(p => {
        if (vy > 0 && x > p.x - 10 && x < p.x + p.w + 10 && y > p.y - cameraY - 5 && y < p.y - cameraY + 10) {
          vy = -10;
        }
      });

      if (y < H / 3) {
        const shift = H / 3 - y; y = H / 3; cameraY -= shift;
        s += Math.floor(shift); setScore(s);
      }

      // Add new platforms
      while (platforms[platforms.length - 1].y - cameraY > -50) {
        platforms.push({ x: Math.random() * (W - 60), y: platforms[platforms.length - 1].y - 50 - Math.random() * 30, w: 60 });
      }
      // Remove old ones
      while (platforms[0].y - cameraY > H + 50) platforms.shift();

      if (y > H + 50) { setGameOver(true); clearInterval(loop); return; }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      platforms.forEach(p => { ctx.fillStyle = '#22c55e'; ctx.fillRect(p.x, p.y - cameraY, p.w, 10); });
      ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); window.removeEventListener('keyup', handlerUp); };
  }, []);

  return (
    <GameLayout title="Doodle Jump" onRestart={reset} accentColor="magenta" rules="← → to move (wraps around edges).\nBounce on platforms to go higher.\nDon't fall off the bottom!" score={<div className="text-sm">Height: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-secondary mb-3 animate-scale-in">Fell! Height: {score}</div>}
      <canvas ref={canvasRef} width={300} height={500} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default DoodleJumpPage;
