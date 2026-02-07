import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SHAPES = ['●', '■', '▲', '◆'];
const HEIGHTS = ['tall', 'short'];
const FILLS = ['solid', 'hollow'];
const COLORS_Q = ['text-red-400', 'text-blue-400'];

interface Piece { shape: number; height: number; fill: number; color: number; id: number; }
const allPieces: Piece[] = [];
let id = 0;
for (let s = 0; s < 4; s++) for (let h = 0; h < 2; h++) for (let f = 0; f < 2; f++) for (let c = 0; c < 2; c++) allPieces.push({ shape: s, height: h, fill: f, color: c, id: id++ });

const QuartoPage = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(() => Array.from({ length: 4 }, () => Array(4).fill(null)));
  const [available, setAvailable] = useState<Piece[]>([...allPieces]);
  const [selected, setSelected] = useState<Piece | null>(null);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(0);

  const reset = useCallback(() => { setBoard(Array.from({ length: 4 }, () => Array(4).fill(null))); setAvailable([...allPieces]); setSelected(null); setTurn(1); setWinner(0); }, []);

  const checkLine = (pieces: (Piece | null)[]): boolean => {
    const valid = pieces.filter(Boolean) as Piece[];
    if (valid.length !== 4) return false;
    return ['shape', 'height', 'fill', 'color'].some(attr => valid.every(p => (p as any)[attr] === (valid[0] as any)[attr]));
  };

  const checkWin = (b: (Piece | null)[][]) => {
    for (let i = 0; i < 4; i++) { if (checkLine(b[i]) || checkLine(b.map(r => r[i]))) return true; }
    if (checkLine([b[0][0], b[1][1], b[2][2], b[3][3]]) || checkLine([b[0][3], b[1][2], b[2][1], b[3][0]])) return true;
    return false;
  };

  const place = (r: number, c: number) => {
    if (!selected || board[r][c] || winner) return;
    const nb = board.map(row => [...row]); nb[r][c] = selected; setBoard(nb);
    if (checkWin(nb)) { setWinner(turn); setSelected(null); return; }
    setSelected(null); setTurn(turn === 1 ? 2 : 1);
  };

  const renderPiece = (p: Piece) => (
    <span className={`${COLORS_Q[p.color]} ${p.height === 0 ? 'text-xl' : 'text-sm'} ${p.fill === 1 ? 'opacity-50' : ''}`}>
      {SHAPES[p.shape]}
    </span>
  );

  return (
    <GameLayout title="Quarto" onRestart={reset} accentColor="magenta" rules="Choose a piece for your opponent to place.\nPlace it on the board.\n4 in a row sharing ANY attribute wins!\n(same shape, height, fill, or color)" score={<div className="text-sm">{winner ? `P${winner} Wins!` : selected ? `P${turn}: Place the piece` : `P${turn === 1 ? 2 : 1}: Choose a piece for P${turn}`}</div>}>
      {winner > 0 && <div className="text-xl font-display font-bold text-secondary mb-3 animate-scale-in">Player {winner} Wins! 🏆</div>}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => place(r, c)}
            className="w-14 h-14 rounded-lg bg-muted/30 border border-border flex items-center justify-center hover:bg-muted/50">
            {cell && renderPiece(cell)}
          </button>
        )))}
      </div>
      {selected && <div className="mb-2 text-sm">Selected: {renderPiece(selected)}</div>}
      <div className="text-xs text-muted-foreground mb-1">Available pieces:</div>
      <div className="flex gap-1 flex-wrap max-w-sm justify-center">
        {available.filter(p => !board.flat().some(c => c?.id === p.id) && p.id !== selected?.id).map(p => (
          <button key={p.id} onClick={() => !selected && setSelected(p)}
            className="w-10 h-10 rounded border border-border bg-muted/20 flex items-center justify-center hover:bg-muted/40">{renderPiece(p)}</button>
        ))}
      </div>
    </GameLayout>
  );
};
export default QuartoPage;
