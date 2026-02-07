import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

type PieceT = { color: 'r' | 'b'; king: boolean } | null;

const initBoard = (): PieceT[][] => {
  const b: PieceT[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) b[r][c] = { color: 'b', king: false };
  for (let r = 5; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) b[r][c] = { color: 'r', king: false };
  return b;
};

const CheckersPage = () => {
  const [board, setBoard] = useState<PieceT[][]>(initBoard);
  const [turn, setTurn] = useState<'r' | 'b'>('r');
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<{ to: [number, number]; captures?: [number, number] }[]>([]);
  const [scores, setScores] = useState({ r: 0, b: 0 });
  const [winner, setWinner] = useState('');

  const getMoves = (b: PieceT[][], r: number, c: number) => {
    const piece = b[r][c];
    if (!piece) return [];
    const moves: { to: [number, number]; captures?: [number, number] }[] = [];
    const dirs = piece.king ? [-1, 1] : piece.color === 'r' ? [-1] : [1];
    dirs.forEach(dr => {
      [-1, 1].forEach(dc => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          if (!b[nr][nc]) moves.push({ to: [nr, nc] });
          else if (b[nr][nc]!.color !== piece.color) {
            const jr = nr + dr, jc = nc + dc;
            if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !b[jr][jc])
              moves.push({ to: [jr, jc], captures: [nr, nc] });
          }
        }
      });
    });
    return moves;
  };

  const reset = useCallback(() => { setBoard(initBoard()); setTurn('r'); setSelected(null); setValidMoves([]); setScores({ r: 0, b: 0 }); setWinner(''); }, []);

  const handleClick = (r: number, c: number) => {
    if (winner) return;
    if (selected) {
      const move = validMoves.find(m => m.to[0] === r && m.to[1] === c);
      if (move) {
        const nb = board.map(row => [...row]);
        nb[r][c] = nb[selected[0]][selected[1]];
        nb[selected[0]][selected[1]] = null;
        if (move.captures) { nb[move.captures[0]][move.captures[1]] = null; setScores(s => ({ ...s, [turn]: s[turn as keyof typeof s] + 1 })); }
        if ((r === 0 && nb[r][c]?.color === 'r') || (r === 7 && nb[r][c]?.color === 'b')) nb[r][c] = { ...nb[r][c]!, king: true };

        const enemy = turn === 'r' ? 'b' : 'r';
        const enemyPieces = nb.flat().filter(p => p?.color === enemy).length;
        if (enemyPieces === 0) setWinner(turn === 'r' ? 'Red' : 'Black');

        setBoard(nb); setTurn(enemy); setSelected(null); setValidMoves([]);
      } else if (board[r][c]?.color === turn) {
        setSelected([r, c]); setValidMoves(getMoves(board, r, c));
      } else { setSelected(null); setValidMoves([]); }
    } else if (board[r][c]?.color === turn) {
      setSelected([r, c]); setValidMoves(getMoves(board, r, c));
    }
  };

  return (
    <GameLayout title="Checkers" onRestart={reset} accentColor="magenta"
      rules="Click a piece to select, then click to move diagonally.\nJump over enemy pieces to capture them.\nReach the opposite end to become a King (can move both directions).\nCapture all enemy pieces to win!"
      score={<div className="flex gap-6 text-sm"><span className="text-red-400">Red: {scores.r}</span><span className="text-blue-400">Black: {scores.b}</span></div>}>
      {winner && <div className="text-2xl font-display font-bold text-secondary mb-4 animate-scale-in">{winner} Wins! 🏆</div>}
      <div className="text-sm text-muted-foreground mb-2">{!winner && `${turn === 'r' ? 'Red' : 'Black'}'s turn`}</div>
      <div className="grid grid-cols-8 border-2 border-border rounded-lg overflow-hidden">
        {board.map((row, r) => row.map((cell, c) => {
          const dark = (r + c) % 2 === 1;
          const isSel = selected?.[0] === r && selected?.[1] === c;
          const isValid = validMoves.some(m => m.to[0] === r && m.to[1] === c);
          return (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
              className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center transition-all
                ${dark ? 'bg-muted/70' : 'bg-muted/20'}
                ${isSel ? 'ring-2 ring-secondary' : ''} ${isValid ? 'bg-secondary/20' : ''}`}>
              {cell && (
                <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold
                  ${cell.color === 'r' ? 'bg-red-500/80 border-red-300' : 'bg-gray-700 border-gray-400'}`}>
                  {cell.king && '👑'}
                </div>
              )}
              {isValid && !cell && <div className="w-3 h-3 rounded-full bg-secondary/50" />}
            </button>
          );
        }))}
      </div>
    </GameLayout>
  );
};

export default CheckersPage;
