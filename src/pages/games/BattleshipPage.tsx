import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 10;
type Cell = 'empty' | 'ship' | 'hit' | 'miss';

const placeShips = (): Cell[][] => {
  const g: Cell[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill('empty'));
  const ships = [5, 4, 3, 3, 2];
  ships.forEach(len => {
    let placed = false;
    while (!placed) {
      const hor = Math.random() > 0.5;
      const r = Math.floor(Math.random() * (hor ? SIZE : SIZE - len));
      const c = Math.floor(Math.random() * (hor ? SIZE - len : SIZE));
      let ok = true;
      for (let i = 0; i < len; i++) { if (g[hor ? r : r + i][hor ? c + i : c] !== 'empty') ok = false; }
      if (ok) { for (let i = 0; i < len; i++) g[hor ? r : r + i][hor ? c + i : c] = 'ship'; placed = true; }
    }
  });
  return g;
};

const BattleshipPage = () => {
  const [aiBoard] = useState<Cell[][]>(placeShips);
  const [display, setDisplay] = useState<Cell[][]>(() => Array.from({ length: SIZE }, () => Array(SIZE).fill('empty')));
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  const totalShips = 17;

  const reset = useCallback(() => window.location.reload(), []);

  const fire = (r: number, c: number) => {
    if (display[r][c] !== 'empty') return;
    const nd = display.map(row => [...row]);
    if (aiBoard[r][c] === 'ship') { nd[r][c] = 'hit'; setHits(h => h + 1); }
    else nd[r][c] = 'miss';
    setDisplay(nd); setShots(s => s + 1);
  };

  return (
    <GameLayout title="Battleship" onRestart={reset} accentColor="cyan" rules="Click cells to fire torpedoes.\n🔴 = Hit, 💧 = Miss\nSink all ships to win!\nShips: 5, 4, 3, 3, 2 cells" score={<div className="flex gap-4 text-sm"><span>Shots: {shots}</span><span>Hits: {hits}/{totalShips}</span></div>}>
      {hits >= totalShips && <div className="text-2xl font-display font-bold text-primary mb-3 animate-scale-in">🎉 All Ships Sunk in {shots} shots!</div>}
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {display.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => fire(r, c)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-sm transition-all
              ${cell === 'hit' ? 'bg-red-500/40' : cell === 'miss' ? 'bg-blue-500/20' : 'bg-primary/10 border border-border/30 hover:bg-primary/20'}`}>
            {cell === 'hit' ? '🔴' : cell === 'miss' ? '💧' : ''}
          </button>
        )))}
      </div>
    </GameLayout>
  );
};
export default BattleshipPage;
