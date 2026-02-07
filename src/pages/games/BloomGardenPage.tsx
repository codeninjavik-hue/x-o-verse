import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const FLOWERS = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐'];
const SIZE = 6;

const BloomGardenPage = () => {
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Math.floor(Math.random() * FLOWERS.length))));
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const reset = useCallback(() => { setGrid(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Math.floor(Math.random() * FLOWERS.length)))); setScore(0); setSelected(null); }, []);

  const swap = (r: number, c: number) => {
    if (!selected) { setSelected([r, c]); return; }
    const [sr, sc] = selected;
    if (Math.abs(sr - r) + Math.abs(sc - c) !== 1) { setSelected([r, c]); return; }

    const ng = grid.map(row => [...row]);
    [ng[sr][sc], ng[r][c]] = [ng[r][c], ng[sr][sc]];

    // Check matches
    let matched = false;
    const toRemove = new Set<string>();
    for (let row = 0; row < SIZE; row++) for (let col = 0; col < SIZE - 2; col++) {
      if (ng[row][col] === ng[row][col+1] && ng[row][col] === ng[row][col+2]) { toRemove.add(`${row}-${col}`); toRemove.add(`${row}-${col+1}`); toRemove.add(`${row}-${col+2}`); matched = true; }
    }
    for (let col = 0; col < SIZE; col++) for (let row = 0; row < SIZE - 2; row++) {
      if (ng[row][col] === ng[row+1][col] && ng[row][col] === ng[row+2][col]) { toRemove.add(`${row}-${col}`); toRemove.add(`${row+1}-${col}`); toRemove.add(`${row+2}-${col}`); matched = true; }
    }

    if (matched) {
      toRemove.forEach(key => { const [rr, cc] = key.split('-').map(Number); ng[rr][cc] = Math.floor(Math.random() * FLOWERS.length); });
      setScore(s => s + toRemove.size * 10);
    }
    setGrid(ng); setSelected(null);
  };

  return (
    <GameLayout title="Bloom Garden" onRestart={reset} accentColor="magenta" rules="Swap adjacent flowers to make matches of 3+.\nMatched flowers bloom into new ones.\nTry to get the highest score!" score={<div className="text-sm">Score: {score}</div>}>
      <div className="grid grid-cols-6 gap-1">
        {grid.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => swap(r, c)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-muted/20 border flex items-center justify-center text-2xl transition-all
              ${selected?.[0] === r && selected?.[1] === c ? 'ring-2 ring-secondary scale-110 border-secondary' : 'border-border hover:scale-105'}`}>
            {FLOWERS[cell]}
          </button>
        )))}
      </div>
    </GameLayout>
  );
};
export default BloomGardenPage;
