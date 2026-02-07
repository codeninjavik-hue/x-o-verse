import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const FroggerPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const posRef = useRef({ x: 5, y: 12 });
  const reset = useCallback(() => { posRef.current = { x: 5, y: 12 }; setScore(0); setGameOver(false); }, []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const COLS = 11, ROWS = 13, CELL = 35;
    const lanes = Array.from({ length: ROWS }, (_, r) => ({
      speed: r === 0 || r === 12 || r === 6 ? 0 : (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
      cars: Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => Math.random() * COLS * CELL)
    }));

    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const p = posRef.current;
      if (e.key === 'ArrowUp' && p.y > 0) p.y--;
      if (e.key === 'ArrowDown' && p.y < ROWS - 1) p.y++;
      if (e.key === 'ArrowLeft' && p.x > 0) p.x--;
      if (e.key === 'ArrowRight' && p.x < COLS - 1) p.x++;
      if (p.y === 0) { setScore(s => s + 100); p.y = 12; p.x = 5; }
    };
    window.addEventListener('keydown', handler);

    const loop = setInterval(() => {
      const p = posRef.current;
      lanes.forEach((lane, r) => {
        lane.cars.forEach((_, i) => { lane.cars[i] = (lane.cars[i] + lane.speed + COLS * CELL) % (COLS * CELL); });
        if (r !== 0 && r !== 12 && r !== 6) {
          lane.cars.forEach(cx => {
            if (Math.abs(cx - p.x * CELL) < CELL && r === p.y) { setGameOver(true); }
          });
        }
      });

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      // Safe zones
      [0, 6, 12].forEach(r => { ctx.fillStyle = '#1a3a1a'; ctx.fillRect(0, r * CELL, COLS * CELL, CELL); });
      // Road lanes
      lanes.forEach((lane, r) => {
        if (r === 0 || r === 12 || r === 6) return;
        lane.cars.forEach(cx => { ctx.fillStyle = r < 6 ? '#4444ff' : '#ff4444'; ctx.fillRect(cx, r * CELL + 5, CELL * 1.5, CELL - 10); });
      });
      // Frog
      ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(p.x * CELL + CELL / 2, p.y * CELL + CELL / 2, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.fillText('🐸', p.x * CELL + 5, p.y * CELL + 25);
    }, 50);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, [gameOver]);

  return (
    <GameLayout title="Frogger" onRestart={reset} accentColor="green" rules="Arrow keys to move the frog.\nCross busy lanes to reach the top.\nAvoid all vehicles!" score={<div className="text-sm">Score: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-green mb-3 animate-scale-in">Squished! Score: {score}</div>}
      <canvas ref={canvasRef} width={385} height={455} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default FroggerPage;
