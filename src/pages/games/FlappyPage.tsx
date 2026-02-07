import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const FlappyPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const reset = useCallback(() => { setScore(0); setGameOver(false); setStarted(false); }, []);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 300, H = 400;
    let y = H / 2, vy = 0; const G = 0.4, FLAP = -7;
    let pipes: { x: number; gap: number }[] = [{ x: 300, gap: 150 }];
    let s = 0; let running = true;

    const flap = () => { if (running) vy = FLAP; };
    const handler = (e: KeyboardEvent) => { if (e.key === ' ') { e.preventDefault(); flap(); } };
    window.addEventListener('keydown', handler);
    canvas.onclick = flap;

    const loop = setInterval(() => {
      if (!running) return;
      vy += G; y += vy;
      pipes.forEach(p => p.x -= 2);
      if (pipes[pipes.length - 1].x < 150) pipes.push({ x: 300, gap: 100 + Math.random() * 200 });
      pipes = pipes.filter(p => p.x > -50);

      pipes.forEach(p => {
        if (p.x > 25 && p.x < 35) { s++; setScore(s); }
        if (30 > p.x - 25 && 30 < p.x + 25) {
          if (y < p.gap - 50 || y > p.gap + 50) { running = false; setGameOver(true); }
        }
      });
      if (y > H || y < 0) { running = false; setGameOver(true); }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      pipes.forEach(p => {
        ctx.fillStyle = '#22c55e88'; ctx.fillRect(p.x - 20, 0, 40, p.gap - 50); ctx.fillRect(p.x - 20, p.gap + 50, 40, H);
      });
      ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(30, y, 12, 0, Math.PI * 2); ctx.fill();
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, [started]);

  return (
    <GameLayout title="Flappy Bird" onRestart={reset} accentColor="magenta" rules="Press Space or click/tap to flap.\nNavigate through pipe gaps.\nDon't hit pipes or go off screen!" score={<div className="text-sm">Score: {score}</div>}>
      {!started && !gameOver && <button onClick={() => setStarted(true)} className="mb-3 px-6 py-2 rounded-lg bg-secondary/20 border border-secondary text-secondary font-display">Start Game</button>}
      {gameOver && <div className="text-xl font-display font-bold text-secondary mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <canvas ref={canvasRef} width={300} height={400} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default FlappyPage;
