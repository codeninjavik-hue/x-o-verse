import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

type Cell = '' | 'X' | 'O';
const checkWin = (b: Cell[]): Cell => {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b_, c] of wins) { if (b[a] && b[a] === b[b_] && b[a] === b[c]) return b[a]; }
  return '';
};

const UltimateTTTPage = () => {
  const [boards, setBoards] = useState<Cell[][]>(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [winners, setWinners] = useState<Cell[]>(Array(9).fill(''));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [gameWinner, setGameWinner] = useState<Cell>('');

  const reset = useCallback(() => { setBoards(Array.from({ length: 9 }, () => Array(9).fill(''))); setWinners(Array(9).fill('')); setTurn('X'); setActiveBoard(null); setGameWinner(''); }, []);

  const play = (bi: number, ci: number) => {
    if (gameWinner || winners[bi] || boards[bi][ci] || (activeBoard !== null && activeBoard !== bi)) return;
    const nb = boards.map(b => [...b]); nb[bi][ci] = turn; setBoards(nb);
    const nw = [...winners]; const w = checkWin(nb[bi]); if (w) nw[bi] = w;
    setWinners(nw);
    const gw = checkWin(nw); if (gw) setGameWinner(gw);
    setTurn(turn === 'X' ? 'O' : 'X');
    setActiveBoard(nw[ci] ? null : ci);
  };

  return (
    <GameLayout title="Ultimate Tic Tac Toe" onRestart={reset} accentColor="purple" rules="Win small boards to claim them.\nYour move sends opponent to the corresponding board.\nWin 3 boards in a row to win!" score={<div className="text-sm">{gameWinner ? `${gameWinner} Wins!` : `${turn}'s turn`}</div>}>
      {gameWinner && <div className="text-2xl font-display font-bold text-accent mb-3 animate-scale-in">{gameWinner} Wins! 🏆</div>}
      <div className="grid grid-cols-3 gap-2">
        {boards.map((board, bi) => (
          <div key={bi} className={`grid grid-cols-3 gap-0.5 p-1 rounded-lg border-2 transition-all
            ${winners[bi] ? (winners[bi] === 'X' ? 'bg-primary/20 border-primary' : 'bg-secondary/20 border-secondary') :
              (activeBoard === null || activeBoard === bi) ? 'border-accent/50 bg-accent/5' : 'border-border/30 opacity-50'}`}>
            {winners[bi] ? (
              <div className="col-span-3 row-span-3 flex items-center justify-center text-4xl font-bold">{winners[bi]}</div>
            ) : board.map((cell, ci) => (
              <button key={ci} onClick={() => play(bi, ci)}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded flex items-center justify-center text-sm font-bold transition-all
                  ${cell ? '' : 'hover:bg-muted/50'} ${cell === 'X' ? 'text-primary' : 'text-secondary'}`}>
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
    </GameLayout>
  );
};
export default UltimateTTTPage;
