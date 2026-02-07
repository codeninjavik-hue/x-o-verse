import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type Color = 'w' | 'b';
interface Piece { type: PieceType; color: Color; }
type Cell = Piece | null;

const SYMBOLS: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const initBoard = (): Cell[][] => {
  const b: Cell[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
  const backRow: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let c = 0; c < 8; c++) {
    b[0][c] = { type: backRow[c], color: 'b' };
    b[1][c] = { type: 'P', color: 'b' };
    b[6][c] = { type: 'P', color: 'w' };
    b[7][c] = { type: backRow[c], color: 'w' };
  }
  return b;
};

const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

const getMoves = (board: Cell[][], r: number, c: number): [number, number][] => {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const { type, color } = piece;
  const enemy = color === 'w' ? 'b' : 'w';
  const dir = color === 'w' ? -1 : 1;

  const addIfValid = (nr: number, nc: number) => {
    if (inBounds(nr, nc) && board[nr][nc]?.color !== color) moves.push([nr, nc]);
  };
  const addSlide = (dr: number, dc: number) => {
    for (let i = 1; i < 8; i++) {
      const nr = r + dr * i, nc = c + dc * i;
      if (!inBounds(nr, nc)) break;
      if (board[nr][nc]) { if (board[nr][nc]!.color === enemy) moves.push([nr, nc]); break; }
      moves.push([nr, nc]);
    }
  };

  switch (type) {
    case 'P':
      if (inBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        if ((color === 'w' && r === 6) || (color === 'b' && r === 1))
          if (!board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
      }
      if (inBounds(r + dir, c - 1) && board[r + dir][c - 1]?.color === enemy) moves.push([r + dir, c - 1]);
      if (inBounds(r + dir, c + 1) && board[r + dir][c + 1]?.color === enemy) moves.push([r + dir, c + 1]);
      break;
    case 'N':
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => addIfValid(r+dr,c+dc));
      break;
    case 'B': [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => addSlide(dr,dc)); break;
    case 'R': [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => addSlide(dr,dc)); break;
    case 'Q': [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => addSlide(dr,dc)); break;
    case 'K': [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => addIfValid(r+dr,c+dc)); break;
  }
  return moves;
};

const ChessPage = () => {
  const [board, setBoard] = useState<Cell[][]>(initBoard);
  const [turn, setTurn] = useState<Color>('w');
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [captured, setCaptured] = useState<{ w: string[]; b: string[] }>({ w: [], b: [] });
  const [status, setStatus] = useState('');

  const reset = useCallback(() => {
    setBoard(initBoard()); setTurn('w'); setSelected(null); setValidMoves([]); setCaptured({ w: [], b: [] }); setStatus('');
  }, []);

  const handleClick = (r: number, c: number) => {
    if (status) return;
    if (selected) {
      const isValid = validMoves.some(([mr, mc]) => mr === r && mc === c);
      if (isValid) {
        const newBoard = board.map(row => [...row]);
        const cap = newBoard[r][c];
        if (cap) setCaptured(prev => ({ ...prev, [turn]: [...prev[turn], SYMBOLS[cap.color + cap.type]] }));
        newBoard[r][c] = newBoard[selected[0]][selected[1]];
        newBoard[selected[0]][selected[1]] = null;
        // Pawn promotion
        if (newBoard[r][c]?.type === 'P' && (r === 0 || r === 7)) newBoard[r][c] = { type: 'Q', color: turn };
        if (cap?.type === 'K') setStatus(turn === 'w' ? 'White Wins!' : 'Black Wins!');
        setBoard(newBoard); setTurn(turn === 'w' ? 'b' : 'w'); setSelected(null); setValidMoves([]);
      } else if (board[r][c]?.color === turn) {
        setSelected([r, c]); setValidMoves(getMoves(board, r, c));
      } else { setSelected(null); setValidMoves([]); }
    } else if (board[r][c]?.color === turn) {
      setSelected([r, c]); setValidMoves(getMoves(board, r, c));
    }
  };

  return (
    <GameLayout title="Chess" onRestart={reset} accentColor="purple"
      rules="Click a piece to select it, then click a valid square to move.\nCapture opponent pieces by moving to their square.\nCapture the King to win!"
      score={<div className="flex gap-8 text-sm"><span>⬜ Captured: {captured.w.join(' ')}</span><span>⬛ Captured: {captured.b.join(' ')}</span></div>}>
      {status && <div className="text-2xl font-display font-bold text-accent mb-4 animate-scale-in">{status}</div>}
      <div className="text-sm text-muted-foreground mb-2">{!status && `${turn === 'w' ? 'White' : 'Black'}'s turn`}</div>
      <div className="grid grid-cols-8 border-2 border-border rounded-lg overflow-hidden">
        {board.map((row, r) => row.map((cell, c) => {
          const isLight = (r + c) % 2 === 0;
          const isSelected = selected?.[0] === r && selected?.[1] === c;
          const isValid = validMoves.some(([mr, mc]) => mr === r && mc === c);
          return (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
              className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl transition-all
                ${isLight ? 'bg-muted/40' : 'bg-muted/80'}
                ${isSelected ? 'ring-2 ring-primary bg-primary/30' : ''}
                ${isValid ? 'bg-accent/30' : ''}
                hover:brightness-125`}>
              {cell && <span className={cell.color === 'w' ? 'text-foreground drop-shadow-lg' : 'text-muted-foreground'}>{SYMBOLS[cell.color + cell.type]}</span>}
              {isValid && !cell && <div className="w-2 h-2 rounded-full bg-accent/60" />}
            </button>
          );
        }))}
      </div>
    </GameLayout>
  );
};

export default ChessPage;
