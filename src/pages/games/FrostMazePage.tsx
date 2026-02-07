import { useState, useCallback, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 15;
const generateMaze = () => {
  const maze: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(1));
  const carve = (r: number, c: number) => {
    maze[r][c] = 0;
    const dirs = [[0,2],[0,-2],[2,0],[-2,0]].sort(() => Math.random() - 0.5);
    dirs.forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr > 0 && nr < SIZE - 1 && nc > 0 && nc < SIZE - 1 && maze[nr][nc] === 1) {
        maze[r + dr / 2][c + dc / 2] = 0; carve(nr, nc);
      }
    });
  };
  carve(1, 1); maze[SIZE - 2][SIZE - 2] = 0; maze[SIZE - 2][SIZE - 3] = 0;
  return maze;
};

const FrostMazePage = () => {
  const [maze, setMaze] = useState(generateMaze);
  const [pos, setPos] = useState({ r: 1, c: 1 });
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const reset = useCallback(() => { setMaze(generateMaze()); setPos({ r: 1, c: 1 }); setMoves(0); setWon(false); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (won) return;
      const map: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      // Slide until hitting a wall (ice physics!)
      let nr = pos.r, nc = pos.c;
      while (true) {
        const nnr = nr + dir[0], nnc = nc + dir[1];
        if (nnr < 0 || nnr >= SIZE || nnc < 0 || nnc >= SIZE || maze[nnr][nnc] === 1) break;
        nr = nnr; nc = nnc;
      }
      setPos({ r: nr, c: nc }); setMoves(m => m + 1);
      if (nr === SIZE - 2 && nc === SIZE - 2) setWon(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pos, maze, won]);

  return (
    <GameLayout title="Frost Maze" onRestart={reset} accentColor="cyan" rules="Arrow keys to slide on ice.\nYou slide until hitting a wall!\nReach the exit (bottom-right) to win." score={<div className="text-sm">Moves: {moves}</div>}>
      {won && <div className="text-2xl font-display font-bold text-primary mb-3 animate-scale-in">🎉 Escaped in {moves} moves!</div>}
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {maze.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className={`w-5 h-5 sm:w-7 sm:h-7 transition-all
            ${cell === 1 ? 'bg-cyan-900/60' : 'bg-cyan-50/5'}
            ${pos.r === r && pos.c === c ? 'bg-primary shadow-[0_0_10px_hsl(180,100%,50%)]' : ''}
            ${r === SIZE - 2 && c === SIZE - 2 ? 'bg-neon-green/30' : ''}`} />
        )))}
      </div>
    </GameLayout>
  );
};
export default FrostMazePage;
