import { useState, useEffect, useCallback, useRef } from 'react';
import GameLayout from '@/components/GameLayout';

const COLORS_CR = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500'];

const ColorRushPage = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [target, setTarget] = useState(0);
  const [playing, setPlaying] = useState(false);

  const initGrid = useCallback(() => Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 5))), []);

  const start = useCallback(() => { setGrid(initGrid()); setScore(0); setTimeLeft(30); setTarget(Math.floor(Math.random() * 5)); setPlaying(true); }, [initGrid]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setTimeLeft(t => { if (t <= 1) { setPlaying(false); return 0; } return t - 1; }), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const handleClick = (r: number, c: number) => {
    if (!playing || grid[r][c] !== target) return;
    const ng = grid.map(row => [...row]);
    ng[r][c] = Math.floor(Math.random() * 5);
    setGrid(ng); setScore(s => s + 1);
    if (score % 5 === 4) setTarget(Math.floor(Math.random() * 5));
  };

  return (
    <GameLayout title="Color Rush" onRestart={start} accentColor="magenta" rules="Click cells matching the target color!\nSpeed is everything — 30 seconds!\nTarget changes every 5 hits." score={<div className="flex gap-4 text-sm"><span>Score: {score}</span><span>Time: {timeLeft}s</span></div>}>
      {!playing && timeLeft === 0 && <div className="text-2xl font-display font-bold text-secondary mb-3 animate-scale-in">Time's Up! Score: {score} 🎯</div>}
      {!playing && timeLeft > 0 && <button onClick={start} className="mb-3 px-6 py-2 rounded-lg bg-secondary/20 border border-secondary text-secondary font-display">Start!</button>}
      <div className="flex items-center gap-2 mb-3"><span className="text-xs">Target:</span><div className={`w-8 h-8 rounded ${COLORS_CR[target]}`} /></div>
      <div className="grid grid-cols-6 gap-1">
        {grid.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${COLORS_CR[cell]} transition-all hover:scale-110 active:scale-95 ${cell === target ? 'ring-2 ring-foreground/30' : ''}`} />
        )))}
      </div>
    </GameLayout>
  );
};
export default ColorRushPage;
