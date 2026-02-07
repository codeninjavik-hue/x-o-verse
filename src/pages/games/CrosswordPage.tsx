import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const CLUES = [
  { word: 'REACT', row: 0, col: 0, dir: 'across', clue: 'Popular JS framework' },
  { word: 'ARRAY', row: 0, col: 0, dir: 'down', clue: 'Ordered data structure' },
  { word: 'CODE', row: 2, col: 1, dir: 'across', clue: 'What programmers write' },
  { word: 'NEON', row: 1, col: 4, dir: 'down', clue: 'Glowing light type' },
  { word: 'TYPE', row: 0, col: 4, dir: 'down', clue: 'Kind or category' },
];

const GRID_SIZE = 6;

const CrosswordPage = () => {
  const [grid, setGrid] = useState<string[][]>(() => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('')));
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const reset = useCallback(() => { setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''))); setSelected(null); }, []);

  const validCells = new Set<string>();
  CLUES.forEach(({ word, row, col, dir }) => {
    for (let i = 0; i < word.length; i++) {
      if (dir === 'across') validCells.add(`${row}-${col + i}`);
      else validCells.add(`${row + i}-${col}`);
    }
  });

  const handleInput = (r: number, c: number, val: string) => {
    if (!validCells.has(`${r}-${c}`)) return;
    const ng = grid.map(row => [...row]);
    ng[r][c] = val.toUpperCase().slice(0, 1);
    setGrid(ng);
  };

  const checkWord = (clue: typeof CLUES[0]) => {
    for (let i = 0; i < clue.word.length; i++) {
      const r = clue.dir === 'across' ? clue.row : clue.row + i;
      const c = clue.dir === 'across' ? clue.col + i : clue.col;
      if (grid[r]?.[c] !== clue.word[i]) return false;
    }
    return true;
  };

  const solved = CLUES.every(checkWord);

  return (
    <GameLayout title="Crossword" onRestart={reset} accentColor="orange"
      rules="Fill in the grid using the clues provided.\nClick a cell and type a letter.\nComplete all words to solve the puzzle!">
      {solved && <div className="text-2xl font-display font-bold text-neon-orange mb-3 animate-scale-in">🎉 Puzzle Solved!</div>}
      <div className="grid gap-0.5 mb-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {grid.map((row, r) => row.map((cell, c) => {
          const isValid = validCells.has(`${r}-${c}`);
          const isSel = selected?.[0] === r && selected?.[1] === c;
          return (
            <div key={`${r}-${c}`}
              className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-sm font-bold rounded
                ${isValid ? (isSel ? 'bg-neon-orange/30 border-2 border-neon-orange' : 'bg-muted/50 border border-border') : 'bg-background'}
                ${isValid ? 'cursor-text' : ''}`}
              onClick={() => isValid && setSelected([r, c])}>
              {isValid && (
                <input value={cell} maxLength={1}
                  onChange={e => handleInput(r, c, e.target.value)}
                  onFocus={() => setSelected([r, c])}
                  className="w-full h-full bg-transparent text-center font-bold text-foreground outline-none" />
              )}
            </div>
          );
        }))}
      </div>
      <div className="text-sm space-y-1 max-w-sm">
        <div className="font-display font-bold text-muted-foreground">Across:</div>
        {CLUES.filter(c => c.dir === 'across').map((c, i) => (
          <div key={i} className={`text-xs ${checkWord(c) ? 'text-neon-green line-through' : 'text-muted-foreground'}`}>
            {c.row + 1}. {c.clue} ({c.word.length} letters)
          </div>
        ))}
        <div className="font-display font-bold text-muted-foreground mt-2">Down:</div>
        {CLUES.filter(c => c.dir === 'down').map((c, i) => (
          <div key={i} className={`text-xs ${checkWord(c) ? 'text-neon-green line-through' : 'text-muted-foreground'}`}>
            {c.col + 1}. {c.clue} ({c.word.length} letters)
          </div>
        ))}
      </div>
    </GameLayout>
  );
};

export default CrosswordPage;
