import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const ROWS = 6, COLS = 7;
type Cell = 0 | 1 | 2;

const checkWin = (b: Cell[][], player: Cell): boolean => {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (c + 3 < COLS && b[r][c] === player && b[r][c+1] === player && b[r][c+2] === player && b[r][c+3] === player) return true;
    if (r + 3 < ROWS && b[r][c] === player && b[r+1][c] === player && b[r+2][c] === player && b[r+3][c] === player) return true;
    if (r + 3 < ROWS && c + 3 < COLS && b[r][c] === player && b[r+1][c+1] === player && b[r+2][c+2] === player && b[r+3][c+3] === player) return true;
    if (r + 3 < ROWS && c - 3 >= 0 && b[r][c] === player && b[r+1][c-1] === player && b[r+2][c-2] === player && b[r+3][c-3] === player) return true;
  }
  return false;
};

const ConnectFourPage = () => {
  const [board, setBoard] = useState<Cell[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<string>('');
  const [hoverCol, setHoverCol] = useState(-1);

  const reset = useCallback(() => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setTurn(1); setWinner('');
  }, []);

  const drop = (col: number) => {
    if (winner) return;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        const nb = board.map(row => [...row]);
        nb[r][col] = turn;
        setBoard(nb);
        if (checkWin(nb, turn)) { setWinner(`Player ${turn}`); return; }
        if (nb.every(row => row.every(c => c !== 0))) { setWinner('Draw'); return; }
        setTurn(turn === 1 ? 2 : 1);
        return;
      }
    }
  };

  return (
    <GameLayout title="Connect Four" onRestart={reset} accentColor="orange"
      rules="Drop discs into columns.\nConnect 4 in a row (horizontal, vertical, or diagonal) to win!\n\n🔴 Player 1 vs 🟡 Player 2">
      {winner && <div className="text-2xl font-display font-bold text-neon-orange mb-4 animate-scale-in">{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins! 🏆`}</div>}
      <div className="text-sm text-muted-foreground mb-2">{!winner && `Player ${turn}'s turn ${turn === 1 ? '🔴' : '🟡'}`}</div>
      <div className="bg-blue-900/30 p-2 rounded-xl border border-border">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: COLS }, (_, c) => (
            <button key={c} onClick={() => drop(c)} onMouseEnter={() => setHoverCol(c)} onMouseLeave={() => setHoverCol(-1)}
              className={`h-8 rounded-t-lg transition-all ${hoverCol === c ? 'bg-muted/50' : ''}`}>
              <div className={`w-4 h-4 mx-auto rounded-full ${hoverCol === c ? (turn === 1 ? 'bg-red-400/50' : 'bg-yellow-400/50') : ''}`} />
            </button>
          ))}
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => drop(c)}
              className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-950/50 rounded-full flex items-center justify-center">
              <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-300
                ${cell === 1 ? 'bg-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : cell === 2 ? 'bg-yellow-400 shadow-[0_0_15px_rgba(255,255,0,0.5)]' : 'bg-muted/20'}`} />
            </button>
          )))}
        </div>
      </div>
    </GameLayout>
  );
};

export default ConnectFourPage;
