import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const WORDS = ['REACT', 'NEON', 'GAME', 'CODE', 'PLAY', 'GRID', 'HACK', 'BYTE'];
const SIZE = 10;

const generateGrid = (): { grid: string[][]; placed: string[] } => {
  const grid: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const placed: string[] = [];
  const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0]];

  WORDS.forEach(word => {
    for (let attempt = 0; attempt < 50; attempt++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) { fits = false; break; }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { fits = false; break; }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i];
        placed.push(word); break;
      }
    }
  });

  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (grid[r][c] === '') grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  return { grid, placed };
};

const WordSearchPage = () => {
  const [{ grid, placed }] = useState(generateGrid);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<[number, number][]>([]);

  const reset = useCallback(() => { window.location.reload(); }, []);

  const handleClick = (r: number, c: number) => {
    const ns = [...selected, [r, c] as [number, number]];
    const word = ns.map(([r, c]) => grid[r][c]).join('');
    if (placed.includes(word) && !found.has(word)) {
      setFound(new Set([...found, word]));
      setSelected([]);
    } else if (word.length >= 8) {
      setSelected([]);
    } else {
      setSelected(ns);
    }
  };

  const isSelected = (r: number, c: number) => selected.some(([sr, sc]) => sr === r && sc === c);

  return (
    <GameLayout title="Word Search" onRestart={reset} accentColor="purple"
      rules="Find hidden words in the grid.\nClick letters in sequence to spell a word.\nWords can go horizontal, vertical, or diagonal.\nFind all words to win!">
      {found.size === placed.length && <div className="text-2xl font-display font-bold text-accent mb-3 animate-scale-in">🎉 All Words Found!</div>}
      <div className="flex gap-2 flex-wrap mb-3">
        {placed.map(w => (
          <span key={w} className={`px-2 py-1 rounded text-xs font-display ${found.has(w) ? 'bg-accent/20 text-accent line-through' : 'bg-muted/30 text-muted-foreground'}`}>{w}</span>
        ))}
      </div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {grid.map((row, r) => row.map((letter, c) => (
          <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center font-bold text-sm transition-all
              ${isSelected(r, c) ? 'bg-accent/30 text-accent scale-110' : 'bg-muted/30 hover:bg-muted/50'}`}>
            {letter}
          </button>
        )))}
      </div>
    </GameLayout>
  );
};

export default WordSearchPage;
