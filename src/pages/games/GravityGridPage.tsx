import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 6;
const COLORS_GG = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400'];

const GravityGridPage = () => {
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Math.floor(Math.random() * 4))));
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  const reset = useCallback(() => { setGrid(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Math.floor(Math.random() * 4)))); setMoves(0); setScore(0); }, []);

  const applyGravity = (g: number[][], dir: string) => {
    const ng = g.map(r => [...r]);
    if (dir === 'down') {
      for (let c = 0; c < SIZE; c++) {
        const col = ng.map(r => r[c]).filter(v => v >= 0);
        while (col.length < SIZE) col.unshift(-1);
        col.forEach((v, r) => ng[r][c] = v);
      }
    } else if (dir === 'left') {
      for (let r = 0; r < SIZE; r++) {
        const row = ng[r].filter(v => v >= 0);
        while (row.length < SIZE) row.push(-1);
        ng[r] = row;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < SIZE; r++) {
        const row = ng[r].filter(v => v >= 0);
        while (row.length < SIZE) row.unshift(-1);
        ng[r] = row;
      }
    }
    return ng;
  };

  const removeMatches = (g: number[][]): { grid: number[][]; removed: number } => {
    const ng = g.map(r => [...r]);
    let removed = 0;
    const toRemove = new Set<string>();
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE - 2; c++) {
      if (ng[r][c] >= 0 && ng[r][c] === ng[r][c+1] && ng[r][c] === ng[r][c+2]) { toRemove.add(`${r}-${c}`); toRemove.add(`${r}-${c+1}`); toRemove.add(`${r}-${c+2}`); }
    }
    for (let c = 0; c < SIZE; c++) for (let r = 0; r < SIZE - 2; r++) {
      if (ng[r][c] >= 0 && ng[r][c] === ng[r+1][c] && ng[r][c] === ng[r+2][c]) { toRemove.add(`${r}-${c}`); toRemove.add(`${r+1}-${c}`); toRemove.add(`${r+2}-${c}`); }
    }
    toRemove.forEach(key => { const [r, c] = key.split('-').map(Number); ng[r][c] = -1; removed++; });
    return { grid: ng, removed };
  };

  const rotate = (dir: string) => {
    let ng = applyGravity(grid, dir);
    const { grid: cleaned, removed } = removeMatches(ng);
    setGrid(applyGravity(cleaned, 'down').map(r => r.map(v => v < 0 ? Math.floor(Math.random() * 4) : v)));
    setScore(s => s + removed * 10); setMoves(m => m + 1);
  };

  return (
    <GameLayout title="Gravity Grid" onRestart={reset} accentColor="purple" rules="Use gravity directions to shift blocks.\nMatch 3+ in a row to clear them.\nScore as many points as possible!" score={<div className="flex gap-4 text-sm"><span>Score: {score}</span><span>Moves: {moves}</span></div>}>
      <div className="grid grid-cols-6 gap-1 mb-4">
        {grid.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all ${cell >= 0 ? COLORS_GG[cell] : 'bg-transparent'}`} />
        )))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => rotate('left')} className="px-4 py-2 rounded-lg bg-accent/20 border border-accent text-accent hover:bg-accent/30">← Gravity</button>
        <button onClick={() => rotate('down')} className="px-4 py-2 rounded-lg bg-accent/20 border border-accent text-accent hover:bg-accent/30">↓ Gravity</button>
        <button onClick={() => rotate('right')} className="px-4 py-2 rounded-lg bg-accent/20 border border-accent text-accent hover:bg-accent/30">Gravity →</button>
      </div>
    </GameLayout>
  );
};
export default GravityGridPage;
