import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 4;
const GOAL = Array.from({ length: SIZE * SIZE }, (_, i) => (i + 1) % (SIZE * SIZE));

const shuffle = (): number[] => {
  const arr = [...GOAL];
  for (let i = 100; i > 0; i--) {
    const blank = arr.indexOf(0);
    const r = Math.floor(blank / SIZE), c = blank % SIZE;
    const dirs = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc]) => nr>=0 && nr<SIZE && nc>=0 && nc<SIZE);
    const [nr, nc] = dirs[Math.floor(Math.random() * dirs.length)];
    [arr[blank], arr[nr * SIZE + nc]] = [arr[nr * SIZE + nc], arr[blank]];
  }
  return arr;
};

const SlidingPuzzlePage = () => {
  const [tiles, setTiles] = useState<number[]>(shuffle);
  const [moves, setMoves] = useState(0);

  const reset = useCallback(() => { setTiles(shuffle()); setMoves(0); }, []);
  const won = JSON.stringify(tiles) === JSON.stringify(GOAL);

  const handleClick = (idx: number) => {
    if (won) return;
    const blank = tiles.indexOf(0);
    const r = Math.floor(idx / SIZE), c = idx % SIZE;
    const br = Math.floor(blank / SIZE), bc = blank % SIZE;
    if (Math.abs(r - br) + Math.abs(c - bc) !== 1) return;
    const nt = [...tiles]; [nt[idx], nt[blank]] = [nt[blank], nt[idx]];
    setTiles(nt); setMoves(m => m + 1);
  };

  return (
    <GameLayout title="Sliding Puzzle" onRestart={reset} accentColor="green"
      rules="Slide tiles to arrange numbers 1-15 in order.\nClick a tile next to the empty space to move it.\nComplete the puzzle in as few moves as possible!"
      score={<div className="text-sm">Moves: {moves}</div>}>
      {won && <div className="text-2xl font-display font-bold text-neon-green mb-3 animate-scale-in">🎉 Solved in {moves} moves!</div>}
      <div className="grid grid-cols-4 gap-1 w-full max-w-xs">
        {tiles.map((val, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl font-display font-bold transition-all
              ${val === 0 ? 'bg-transparent' : 'bg-neon-green/20 border-2 border-neon-green/50 text-neon-green hover:bg-neon-green/30 hover:scale-105 active:scale-95'}`}>
            {val > 0 && val}
          </button>
        ))}
      </div>
    </GameLayout>
  );
};

export default SlidingPuzzlePage;
