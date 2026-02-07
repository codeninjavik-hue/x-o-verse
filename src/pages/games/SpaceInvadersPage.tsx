import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SpaceInvadersPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 400, H = 400;
    let px = W / 2;
    const bullets: { x: number; y: number }[] = [];
    const aliens: { x: number; y: number; alive: boolean }[] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) aliens.push({ x: c * 45 + 30, y: r * 30 + 30, alive: true });
    let dir = 1, s = 0;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') px = Math.max(15, px - 15);
      if (e.key === 'ArrowRight') px = Math.min(W - 15, px + 15);
      if (e.key === ' ') { e.preventDefault(); bullets.push({ x: px, y: H - 30 }); }
    };
    window.addEventListener('keydown', handler);

    const loop = setInterval(() => {
      bullets.forEach(b => b.y -= 5);
      let edge = false;
      aliens.forEach(a => { if (a.alive) { a.x += dir; if (a.x < 10 || a.x > W - 10) edge = true; } });
      if (edge) { dir = -dir; aliens.forEach(a => a.y += 10); }

      bullets.forEach(b => {
        aliens.forEach(a => {
          if (a.alive && Math.abs(b.x - a.x) < 15 && Math.abs(b.y - a.y) < 10) {
            a.alive = false; b.y = -10; s += 10; setScore(s);
          }
        });
      });

      if (aliens.some(a => a.alive && a.y > H - 50)) { setGameOver(true); clearInterval(loop); return; }
      if (aliens.every(a => !a.alive)) { setGameOver(true); clearInterval(loop); return; }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      aliens.forEach(a => { if (a.alive) { ctx.fillStyle = '#ff006e'; ctx.fillRect(a.x - 10, a.y - 8, 20, 16); } });
      bullets.forEach(b => { ctx.fillStyle = '#00ffff'; ctx.fillRect(b.x - 1, b.y, 3, 8); });
      ctx.fillStyle = '#00ffff'; ctx.fillRect(px - 15, H - 20, 30, 12);
      ctx.fillRect(px - 2, H - 25, 4, 8);
    }, 50);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, []);

  return (
    <GameLayout title="Space Invaders" onRestart={reset} accentColor="purple" rules="← → to move, Space to shoot.\nDestroy all aliens before they reach the bottom!" score={<div className="text-sm">Score: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-accent mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <canvas ref={canvasRef} width={400} height={400} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default SpaceInvadersPage;
