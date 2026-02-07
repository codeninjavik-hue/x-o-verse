import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const BreakoutPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => { setScore(0); setGameOver(false); window.location.reload(); }, []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 400, H = 350;
    let px = W / 2 - 30, bx = W / 2, by = H - 30, bdx = 3, bdy = -3;
    const bricks: { x: number; y: number; w: number; h: number; alive: boolean; color: string }[] = [];
    const colors = ['#00ffff', '#ff006e', '#a855f7', '#22c55e', '#f97316'];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) bricks.push({ x: c * 49 + 4, y: r * 20 + 30, w: 45, h: 16, alive: true, color: colors[r] });

    const handler = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') px = Math.max(0, px - 25); if (e.key === 'ArrowRight') px = Math.min(W - 60, px + 25); e.preventDefault(); };
    window.addEventListener('keydown', handler);

    const loop = setInterval(() => {
      bx += bdx; by += bdy;
      if (bx <= 5 || bx >= W - 5) bdx = -bdx;
      if (by <= 5) bdy = -bdy;
      if (by >= H - 15 && bx >= px && bx <= px + 60) { bdy = -Math.abs(bdy); }
      if (by > H) { setGameOver(true); clearInterval(loop); return; }

      bricks.forEach(b => {
        if (b.alive && bx >= b.x && bx <= b.x + b.w && by >= b.y && by <= b.y + b.h) {
          b.alive = false; bdy = -bdy; setScore(s => s + 10);
        }
      });

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      bricks.forEach(b => { if (b.alive) { ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h); } });
      ctx.fillStyle = '#00ffff'; ctx.fillRect(px, H - 12, 60, 8);
      ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();

      if (bricks.every(b => !b.alive)) { setGameOver(true); clearInterval(loop); }
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, []);

  return (
    <GameLayout title="Breakout" onRestart={reset} accentColor="orange" rules="Use ← → arrow keys to move the paddle.\nBounce the ball to break all bricks!\nDon't let the ball fall." score={<div className="text-sm">Score: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-orange mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <canvas ref={canvasRef} width={400} height={350} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default BreakoutPage;
