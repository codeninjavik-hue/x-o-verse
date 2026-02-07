import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const ROWS = 10, COLS = 10, MINES = 15;

type CellState = { mine: boolean; revealed: boolean; flagged: boolean; adjacent: number };

const createBoard = (): CellState[][] => {
  const b: CellState[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
    if (!b[r][c].mine) { b[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (b[r][c].mine) continue;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine) count++;
    }
    b[r][c].adjacent = count;
  }
  return b;
};

const MinesweeperPage = () => {
  const [board, setBoard] = useState<CellState[][]>(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);

  const reset = useCallback(() => { setBoard(createBoard()); setGameOver(false); setWon(false); }, []);

  const reveal = (r: number, c: number) => {
    if (gameOver || won) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    if (flagMode) { nb[r][c].flagged = !nb[r][c].flagged; setBoard(nb); return; }
    if (nb[r][c].flagged || nb[r][c].revealed) return;

    if (nb[r][c].mine) { nb.flat().filter(c => c.mine).forEach(c => c.revealed = true); setBoard(nb); setGameOver(true); return; }

    const flood = (r: number, c: number) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || nb[r][c].revealed || nb[r][c].flagged) return;
      nb[r][c].revealed = true;
      if (nb[r][c].adjacent === 0) { for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(r + dr, c + dc); }
    };
    flood(r, c);
    setBoard(nb);

    const unrevealed = nb.flat().filter(c => !c.revealed && !c.mine).length;
    if (unrevealed === 0) setWon(true);
  };

  const numColors = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-yellow-400', 'text-pink-400', 'text-primary', 'text-foreground'];
  const flags = board.flat().filter(c => c.flagged).length;

  return (
    <GameLayout title="Minesweeper" onRestart={reset} accentColor="magenta"
      rules={`Find all safe cells without hitting a mine!\nNumbers show adjacent mines.\nUse Flag mode to mark suspected mines.\n${MINES} mines hidden in the grid.`}
      score={<div className="text-sm">Mines: {MINES} | Flags: {flags}</div>}>
      {won && <div className="text-2xl font-display font-bold text-neon-green mb-3 animate-scale-in">🎉 You Won!</div>}
      {gameOver && <div className="text-2xl font-display font-bold text-secondary mb-3 animate-scale-in">💥 BOOM! Game Over</div>}

      <button onClick={() => setFlagMode(!flagMode)}
        className={`mb-3 px-4 py-1 rounded-lg border text-sm font-display ${flagMode ? 'bg-secondary/20 border-secondary text-secondary' : 'border-border text-muted-foreground'}`}>
        {flagMode ? '🚩 Flag Mode' : '👆 Reveal Mode'}
      </button>

      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => reveal(r, c)}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-sm flex items-center justify-center text-xs sm:text-sm font-bold transition-all
              ${cell.revealed ? (cell.mine ? 'bg-red-500/30' : 'bg-muted/40') : 'bg-muted/70 hover:bg-muted border border-border/30'}`}>
            {cell.revealed ? (cell.mine ? '💣' : cell.adjacent > 0 ? <span className={numColors[cell.adjacent]}>{cell.adjacent}</span> : '') : cell.flagged ? '🚩' : ''}
          </button>
        )))}
      </div>
    </GameLayout>
  );
};

export default MinesweeperPage;
