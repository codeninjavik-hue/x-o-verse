import { useState, useCallback, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 4;
type Grid = number[][];

const emptyGrid = (): Grid => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

const addRandom = (grid: Grid): Grid => {
  const g = grid.map(r => [...r]);
  const empty: [number, number][] = [];
  g.forEach((row, r) => row.forEach((val, c) => { if (val === 0) empty.push([r, c]); }));
  if (empty.length === 0) return g;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
};

const slide = (row: number[]): { result: number[]; score: number } => {
  let nums = row.filter(n => n !== 0);
  let score = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) { nums[i] *= 2; score += nums[i]; nums[i + 1] = 0; }
  }
  nums = nums.filter(n => n !== 0);
  while (nums.length < SIZE) nums.push(0);
  return { result: nums, score };
};

const move = (grid: Grid, dir: string): { grid: Grid; score: number; moved: boolean } => {
  let g = grid.map(r => [...r]);
  let totalScore = 0;
  let moved = false;

  const doSlide = (arr: number[]) => {
    const { result, score } = slide(arr);
    totalScore += score;
    if (JSON.stringify(arr) !== JSON.stringify(result)) moved = true;
    return result;
  };

  if (dir === 'left') g = g.map(row => doSlide(row));
  else if (dir === 'right') g = g.map(row => doSlide([...row].reverse()).reverse());
  else if (dir === 'up') {
    for (let c = 0; c < SIZE; c++) { const col = g.map(r => r[c]); const res = doSlide(col); res.forEach((v, r) => g[r][c] = v); }
  } else {
    for (let c = 0; c < SIZE; c++) { const col = g.map(r => r[c]).reverse(); const res = doSlide(col).reverse(); res.forEach((v, r) => g[r][c] = v); }
  }
  return { grid: g, score: totalScore, moved };
};

const canMove = (grid: Grid) => {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (grid[r][c] === 0) return true;
    if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
    if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
  }
  return false;
};

const TILE_COLORS: Record<number, string> = {
  2: 'bg-muted/60 text-foreground', 4: 'bg-muted text-foreground',
  8: 'bg-neon-orange/30 text-neon-orange', 16: 'bg-neon-orange/50 text-neon-orange',
  32: 'bg-secondary/30 text-secondary', 64: 'bg-secondary/50 text-secondary',
  128: 'bg-primary/30 text-primary', 256: 'bg-primary/50 text-primary',
  512: 'bg-accent/30 text-accent', 1024: 'bg-accent/50 text-accent',
  2048: 'bg-neon-green/50 text-neon-green',
};

const Game2048Page = () => {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('2048-best') || '0'));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const reset = useCallback(() => { setGrid(addRandom(addRandom(emptyGrid()))); setScore(0); setGameOver(false); setWon(false); }, []);

  const handleMove = useCallback((dir: string) => {
    if (gameOver) return;
    const result = move(grid, dir);
    if (!result.moved) return;
    const newGrid = addRandom(result.grid);
    const newScore = score + result.score;
    setGrid(newGrid); setScore(newScore);
    if (newScore > best) { setBest(newScore); localStorage.setItem('2048-best', String(newScore)); }
    if (newGrid.flat().includes(2048) && !won) setWon(true);
    if (!canMove(newGrid)) setGameOver(true);
  }, [grid, score, best, gameOver, won]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        handleMove(e.key.replace('Arrow', '').toLowerCase());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleMove]);

  // Touch support
  const touchRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    let startX = 0, startY = 0;
    node.ontouchstart = (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    node.ontouchend = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
      else handleMove(dy > 0 ? 'down' : 'up');
    };
  }, [handleMove]);

  return (
    <GameLayout title="2048" onRestart={reset} accentColor="orange"
      rules="Use arrow keys or swipe to slide tiles.\nMatching numbers merge when pushed together.\nReach 2048 to win!\nGame ends when no moves remain."
      score={<div className="flex gap-4 text-sm"><span>Score: {score}</span><span>Best: {best}</span></div>}>
      {won && <div className="text-2xl font-display font-bold text-neon-green mb-3 animate-scale-in">🎉 You reached 2048!</div>}
      {gameOver && <div className="text-2xl font-display font-bold text-secondary mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <div ref={touchRef} className="grid grid-cols-4 gap-2 bg-muted/20 p-3 rounded-xl border border-border w-full max-w-xs">
        {grid.flat().map((val, i) => (
          <div key={i} className={`aspect-square rounded-lg flex items-center justify-center font-display font-bold text-lg sm:text-xl transition-all
            ${val === 0 ? 'bg-muted/10' : TILE_COLORS[val] || 'bg-neon-green/70 text-background'}`}>
            {val > 0 && val}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1 w-32">
        <div />
        <button onClick={() => handleMove('up')} className="p-2 rounded bg-muted/30 border border-border hover:bg-muted/50">↑</button>
        <div />
        <button onClick={() => handleMove('left')} className="p-2 rounded bg-muted/30 border border-border hover:bg-muted/50">←</button>
        <button onClick={() => handleMove('down')} className="p-2 rounded bg-muted/30 border border-border hover:bg-muted/50">↓</button>
        <button onClick={() => handleMove('right')} className="p-2 rounded bg-muted/30 border border-border hover:bg-muted/50">→</button>
      </div>
    </GameLayout>
  );
};

export default Game2048Page;
