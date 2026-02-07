import { useState, useEffect, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 13;
const generateForest = () => {
  const grid: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (Math.random() < 0.3 && !(r === 1 && c === 1) && !(r === SIZE - 2 && c === SIZE - 2)) grid[r][c] = 1;
  // Borders
  for (let i = 0; i < SIZE; i++) { grid[0][i] = 1; grid[SIZE-1][i] = 1; grid[i][0] = 1; grid[i][SIZE-1] = 1; }
  grid[1][1] = 0; grid[SIZE-2][SIZE-2] = 0; grid[SIZE-2][SIZE-3] = 0; grid[SIZE-3][SIZE-2] = 0;
  return grid;
};

const ForestEscapePage = () => {
  const [forest, setForest] = useState(generateForest);
  const [player, setPlayer] = useState({ r: 1, c: 1 });
  const [steps, setSteps] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const [fog, setFog] = useState(true);

  const reset = useCallback(() => { setForest(generateForest()); setPlayer({ r: 1, c: 1 }); setSteps(0); setEscaped(false); }, []);

  const isVisible = (r: number, c: number) => !fog || (Math.abs(r - player.r) <= 2 && Math.abs(c - player.c) <= 2);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (escaped) return;
      const map: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const dir = map[e.key];
      if (!dir) return; e.preventDefault();
      const nr = player.r + dir[0], nc = player.c + dir[1];
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && forest[nr][nc] === 0) {
        setPlayer({ r: nr, c: nc }); setSteps(s => s + 1);
        if (nr === SIZE - 2 && nc === SIZE - 2) setEscaped(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [player, escaped, forest]);

  return (
    <GameLayout title="Forest Escape" onRestart={reset} accentColor="green" rules="Arrow keys to navigate the forest.\nAvoid trees (🌲) and find the exit!\nToggle fog for extra challenge." score={<div className="flex gap-4 text-sm"><span>Steps: {steps}</span></div>}>
      {escaped && <div className="text-2xl font-display font-bold text-neon-green mb-3 animate-scale-in">🎉 Escaped in {steps} steps!</div>}
      <button onClick={() => setFog(!fog)} className="mb-3 px-3 py-1 rounded border border-border text-xs text-muted-foreground hover:bg-muted/30">{fog ? '🌫️ Fog ON' : '👁️ Fog OFF'}</button>
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {forest.map((row, r) => row.map((cell, c) => {
          const visible = isVisible(r, c);
          const isPlayer = player.r === r && player.c === c;
          const isExit = r === SIZE - 2 && c === SIZE - 2;
          return (
            <div key={`${r}-${c}`} className={`w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center text-sm transition-all
              ${!visible ? 'bg-gray-900' : cell === 1 ? 'bg-green-900/60' : 'bg-green-50/5'}
              ${isPlayer ? 'bg-neon-green/40' : ''} ${isExit && visible ? 'bg-neon-green/20' : ''}`}>
              {visible && (isPlayer ? '🏃' : isExit ? '🚪' : cell === 1 ? '🌲' : '')}
            </div>
          );
        }))}
      </div>
    </GameLayout>
  );
};
export default ForestEscapePage;
