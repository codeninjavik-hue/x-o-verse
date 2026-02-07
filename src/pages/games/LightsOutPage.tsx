import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 5;

const randomGrid = (): boolean[][] => {
  const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  for (let i = 0; i < 10; i++) {
    const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
    g[r][c] = !g[r][c];
    if (r > 0) g[r-1][c] = !g[r-1][c];
    if (r < SIZE-1) g[r+1][c] = !g[r+1][c];
    if (c > 0) g[r][c-1] = !g[r][c-1];
    if (c < SIZE-1) g[r][c+1] = !g[r][c+1];
  }
  return g;
};

const LightsOutPage = () => {
  const [grid, setGrid] = useState<boolean[][]>(randomGrid);
  const [moves, setMoves] = useState(0);

  const reset = useCallback(() => { setGrid(randomGrid()); setMoves(0); }, []);

  const toggle = (r: number, c: number) => {
    const ng = grid.map(row => [...row]);
    const flip = (r: number, c: number) => { if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) ng[r][c] = !ng[r][c]; };
    flip(r, c); flip(r-1, c); flip(r+1, c); flip(r, c-1); flip(r, c+1);
    setGrid(ng); setMoves(m => m + 1);
  };

  const won = grid.every(row => row.every(v => !v));

  return (
    <GameLayout title="Lights Out" onRestart={reset} accentColor="purple"
      rules="Turn off all the lights!\nClicking a light toggles it and its neighbors (up, down, left, right).\nFind the right combination to turn everything off."
      score={<div className="text-sm">Moves: {moves}</div>}>
      {won && <div className="text-2xl font-display font-bold text-accent mb-3 animate-scale-in">🎉 All Lights Off!</div>}
      <div className="grid grid-cols-5 gap-2">
        {grid.map((row, r) => row.map((on, c) => (
          <button key={`${r}-${c}`} onClick={() => toggle(r, c)}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg transition-all duration-300
              ${on ? 'bg-accent shadow-[0_0_20px_hsl(var(--accent)/0.5)]' : 'bg-muted/20 border border-border'}
              hover:scale-105 active:scale-95`} />
        )))}
      </div>
    </GameLayout>
  );
};

export default LightsOutPage;
