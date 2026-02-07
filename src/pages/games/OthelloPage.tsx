import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

type Cell = 0 | 1 | 2;
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

const getFlips = (b: Cell[][], r: number, c: number, player: Cell): [number,number][] => {
  if (b[r][c] !== 0) return [];
  const flips: [number,number][] = [];
  const opp: Cell = player === 1 ? 2 : 1;
  DIRS.forEach(([dr,dc]) => {
    const line: [number,number][] = [];
    let nr = r+dr, nc = c+dc;
    while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && b[nr][nc] === opp) {
      line.push([nr,nc]); nr += dr; nc += dc;
    }
    if (line.length > 0 && nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && b[nr][nc] === player) flips.push(...line);
  });
  return flips;
};

const OthelloPage = () => {
  const initBoard = (): Cell[][] => {
    const b: Cell[][] = Array.from({length:8}, () => Array(8).fill(0));
    b[3][3]=2; b[3][4]=1; b[4][3]=1; b[4][4]=2;
    return b;
  };
  const [board, setBoard] = useState<Cell[][]>(initBoard);
  const [turn, setTurn] = useState<1|2>(1);
  const [gameOver, setGameOver] = useState(false);

  const count = (p: Cell) => board.flat().filter(c => c === p).length;

  const getValidMoves = (b: Cell[][], player: Cell) => {
    const moves: [number,number][] = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (getFlips(b, r, c, player).length > 0) moves.push([r,c]);
    return moves;
  };

  const validMoves = getValidMoves(board, turn);

  const reset = useCallback(() => { setBoard(initBoard()); setTurn(1); setGameOver(false); }, []);

  const handleClick = (r: number, c: number) => {
    if (gameOver) return;
    const flips = getFlips(board, r, c, turn);
    if (flips.length === 0) return;
    const nb = board.map(row => [...row]);
    nb[r][c] = turn;
    flips.forEach(([fr,fc]) => nb[fr][fc] = turn);
    const next: 1|2 = turn === 1 ? 2 : 1;
    const nextMoves = getValidMoves(nb, next);
    if (nextMoves.length > 0) { setBoard(nb); setTurn(next); }
    else {
      const curMoves = getValidMoves(nb, turn);
      if (curMoves.length > 0) { setBoard(nb); }
      else { setBoard(nb); setGameOver(true); }
    }
  };

  return (
    <GameLayout title="Othello / Reversi" onRestart={reset} accentColor="green"
      rules="Place a disc to flip opponent's discs between yours.\nYou must flip at least one disc per move.\nThe player with the most discs when no moves remain wins!"
      score={<div className="flex gap-6 text-sm"><span>⚫ Black: {count(1)}</span><span>⚪ White: {count(2)}</span></div>}>
      {gameOver && <div className="text-2xl font-display font-bold text-neon-green mb-4 animate-scale-in">{count(1) > count(2) ? 'Black Wins!' : count(2) > count(1) ? 'White Wins!' : 'Draw!'} 🏆</div>}
      <div className="text-sm text-muted-foreground mb-2">{!gameOver && `${turn === 1 ? '⚫ Black' : '⚪ White'}'s turn`}</div>
      <div className="grid grid-cols-8 gap-0.5 bg-neon-green/20 p-1 rounded-lg border border-border">
        {board.map((row, r) => row.map((cell, c) => {
          const isValid = validMoves.some(([mr,mc]) => mr === r && mc === c);
          return (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-green-900/60 rounded-sm flex items-center justify-center transition-all ${isValid ? 'hover:bg-green-800/80' : ''}`}>
              {cell !== 0 && <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${cell === 1 ? 'bg-gray-900 border-2 border-gray-600' : 'bg-white border-2 border-gray-300'}`} />}
              {isValid && cell === 0 && <div className="w-3 h-3 rounded-full bg-neon-green/40" />}
            </button>
          );
        }))}
      </div>
    </GameLayout>
  );
};

export default OthelloPage;
