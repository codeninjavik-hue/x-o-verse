import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SnakeGamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('snake-best') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef<string>('right');
  const gameRef = useRef<{ snake: number[][]; food: number[]; running: boolean }>({ snake: [[5,5]], food: [10,10], running: true });

  const SIZE = 20, CELL = 20, W = SIZE * CELL;

  const reset = useCallback(() => { gameRef.current = { snake: [[5,5]], food: [Math.floor(Math.random()*SIZE), Math.floor(Math.random()*SIZE)], running: true }; dirRef.current = 'right'; setScore(0); setGameOver(false); }, []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const handler = (e: KeyboardEvent) => {
      const map: Record<string,string> = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
      if (map[e.key]) { e.preventDefault(); dirRef.current = map[e.key]; }
    };
    window.addEventListener('keydown', handler);

    const interval = setInterval(() => {
      const g = gameRef.current; if (!g.running) return;
      const head = [...g.snake[0]];
      if (dirRef.current === 'up') head[1]--; else if (dirRef.current === 'down') head[1]++;
      else if (dirRef.current === 'left') head[0]--; else head[0]++;

      if (head[0] < 0 || head[0] >= SIZE || head[1] < 0 || head[1] >= SIZE || g.snake.some(s => s[0] === head[0] && s[1] === head[1])) {
        g.running = false; setGameOver(true);
        setScore(s => { if (s > best) { setBest(s); localStorage.setItem('snake-best', String(s)); } return s; });
        return;
      }

      g.snake.unshift(head);
      if (head[0] === g.food[0] && head[1] === g.food[1]) {
        g.food = [Math.floor(Math.random()*SIZE), Math.floor(Math.random()*SIZE)];
        setScore(s => s + 1);
      } else g.snake.pop();

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, W);
      g.snake.forEach((s, i) => { ctx.fillStyle = i === 0 ? '#00ffff' : '#00ffff88'; ctx.fillRect(s[0]*CELL, s[1]*CELL, CELL-1, CELL-1); });
      ctx.fillStyle = '#ff006e'; ctx.fillRect(g.food[0]*CELL, g.food[1]*CELL, CELL-1, CELL-1);
    }, 120);

    return () => { clearInterval(interval); window.removeEventListener('keydown', handler); };
  }, [best, gameOver]);

  return (
    <GameLayout title="Snake" onRestart={reset} accentColor="green" rules="Use arrow keys to control the snake.\nEat food to grow.\nDon't hit walls or yourself!" score={<div className="flex gap-4 text-sm"><span>Score: {score}</span><span>Best: {best}</span></div>}>
      {gameOver && <div className="text-xl font-display font-bold text-secondary mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <canvas ref={canvasRef} width={W} height={W} className="border border-border rounded-lg" />
      <div className="mt-3 grid grid-cols-3 gap-1 w-28">
        <div/><button onClick={() => dirRef.current='up'} className="p-2 rounded bg-muted/30 border border-border">↑</button><div/>
        <button onClick={() => dirRef.current='left'} className="p-2 rounded bg-muted/30 border border-border">←</button>
        <button onClick={() => dirRef.current='down'} className="p-2 rounded bg-muted/30 border border-border">↓</button>
        <button onClick={() => dirRef.current='right'} className="p-2 rounded bg-muted/30 border border-border">→</button>
      </div>
    </GameLayout>
  );
};
export default SnakeGamePage;
