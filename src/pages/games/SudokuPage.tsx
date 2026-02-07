import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const generatePuzzle = (): { puzzle: number[][]; solution: number[][] } => {
  const solution: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  const fill = (r: number, c: number): boolean => {
    if (r === 9) return true;
    const nr = c === 8 ? r + 1 : r, nc = c === 8 ? 0 : c + 1;
    const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
    for (const n of nums) {
      if (solution[r].includes(n)) continue;
      if (solution.some(row => row[c] === n)) continue;
      const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
      if (solution.slice(br, br + 3).some(row => row.slice(bc, bc + 3).includes(n))) continue;
      solution[r][c] = n;
      if (fill(nr, nc)) return true;
      solution[r][c] = 0;
    }
    return false;
  };
  fill(0, 0);
  const puzzle = solution.map(r => [...r]);
  let count = 40;
  while (count > 0) {
    const r = Math.floor(Math.random() * 9), c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; count--; }
  }
  return { puzzle, solution };
};

const SudokuPage = () => {
  const [{ puzzle, solution }] = useState(() => generatePuzzle());
  const [grid, setGrid] = useState<number[][]>(() => puzzle.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const reset = useCallback(() => {
    const { puzzle: p, solution: s } = generatePuzzle();
    setGrid(p.map(r => [...r])); setSelected(null); setErrors(new Set());
  }, []);

  const setNumber = (num: number) => {
    if (!selected) return;
    const [r, c] = selected;
    if (puzzle[r][c] !== 0) return;
    const ng = grid.map(row => [...row]);
    ng[r][c] = num;
    setGrid(ng);
    if (num !== 0 && num !== solution[r][c]) {
      setErrors(prev => new Set([...prev, `${r}-${c}`]));
    } else {
      setErrors(prev => { const ns = new Set(prev); ns.delete(`${r}-${c}`); return ns; });
    }
  };

  const won = grid.flat().every((v, i) => v === solution[Math.floor(i / 9)][i % 9]);

  return (
    <GameLayout title="Sudoku" onRestart={reset} accentColor="cyan"
      rules="Fill the 9×9 grid so each row, column, and 3×3 box contains 1-9.\nClick a cell, then pick a number.\nPre-filled numbers cannot be changed.">
      {won && <div className="text-2xl font-display font-bold text-primary mb-3 animate-scale-in">🎉 Puzzle Solved!</div>}
      <div className="grid grid-cols-9 gap-0 border-2 border-primary/50 rounded-lg overflow-hidden">
        {grid.map((row, r) => row.map((val, c) => {
          const isFixed = puzzle[r][c] !== 0;
          const isSel = selected?.[0] === r && selected?.[1] === c;
          const isError = errors.has(`${r}-${c}`);
          return (
            <button key={`${r}-${c}`} onClick={() => !isFixed && setSelected([r, c])}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-bold transition-all
                ${c % 3 === 2 && c < 8 ? 'border-r-2 border-r-primary/30' : 'border-r border-r-border/30'}
                ${r % 3 === 2 && r < 8 ? 'border-b-2 border-b-primary/30' : 'border-b border-b-border/30'}
                ${isSel ? 'bg-primary/30' : ''} ${isError ? 'text-red-400 bg-red-500/10' : isFixed ? 'text-foreground bg-muted/30' : 'text-primary'}
                ${!isFixed ? 'hover:bg-primary/10 cursor-pointer' : 'cursor-default'}`}>
              {val > 0 && val}
            </button>
          );
        }))}
      </div>
      <div className="flex gap-1 mt-4">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => setNumber(n)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-muted/30 border border-border text-sm font-bold hover:bg-primary/20 hover:text-primary transition-all">{n}</button>
        ))}
        <button onClick={() => setNumber(0)} className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-muted/30 border border-border text-xs hover:bg-red-500/20">✕</button>
      </div>
    </GameLayout>
  );
};

export default SudokuPage;
