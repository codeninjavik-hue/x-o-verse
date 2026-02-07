import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SOLUTION = [
  [1,1,0,1,1],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
  [0,1,0,1,0],
];
const SIZE = 5;

const getClues = (line: number[]): number[] => {
  const clues: number[] = [];
  let count = 0;
  line.forEach(v => { if (v === 1) count++; else if (count > 0) { clues.push(count); count = 0; } });
  if (count > 0) clues.push(count);
  return clues.length > 0 ? clues : [0];
};

const NonogramPage = () => {
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(-1)));

  const reset = useCallback(() => { setGrid(Array.from({ length: SIZE }, () => Array(SIZE).fill(-1))); }, []);

  const toggle = (r: number, c: number) => {
    const ng = grid.map(row => [...row]);
    ng[r][c] = ng[r][c] === 1 ? 0 : ng[r][c] === 0 ? -1 : 1;
    setGrid(ng);
  };

  const rowClues = SOLUTION.map(r => getClues(r));
  const colClues = Array.from({ length: SIZE }, (_, c) => getClues(SOLUTION.map(r => r[c])));
  const won = grid.every((row, r) => row.every((v, c) => (v === 1) === (SOLUTION[r][c] === 1)));

  return (
    <GameLayout title="Nonogram" onRestart={reset} accentColor="cyan"
      rules="Fill cells based on the number clues.\nRow clues show consecutive filled groups per row.\nColumn clues show groups per column.\nClick to fill, click again to mark empty, click again to clear.">
      {won && <div className="text-2xl font-display font-bold text-primary mb-3 animate-scale-in">🎉 Picture Complete!</div>}
      <div className="flex">
        <div className="flex flex-col mt-10">
          {rowClues.map((clue, r) => (
            <div key={r} className="h-10 flex items-center justify-end pr-2 gap-1">
              {clue.map((n, i) => <span key={i} className="text-xs text-muted-foreground font-bold">{n}</span>)}
            </div>
          ))}
        </div>
        <div>
          <div className="flex mb-1">
            {colClues.map((clue, c) => (
              <div key={c} className="w-10 flex flex-col items-center justify-end">
                {clue.map((n, i) => <span key={i} className="text-xs text-muted-foreground font-bold">{n}</span>)}
              </div>
            ))}
          </div>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {grid.map((row, r) => row.map((cell, c) => (
              <button key={`${r}-${c}`} onClick={() => toggle(r, c)}
                className={`w-10 h-10 rounded transition-all border
                  ${cell === 1 ? 'bg-primary border-primary' : cell === 0 ? 'bg-muted/20 border-border' : 'bg-muted/50 border-border hover:bg-muted/70'}`}>
                {cell === 0 && <span className="text-muted-foreground">×</span>}
              </button>
            )))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default NonogramPage;
