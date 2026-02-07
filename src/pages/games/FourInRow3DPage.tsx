import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 4;
type Cell = 0 | 1 | 2;

const FourInRow3DPage = () => {
  const [boards, setBoards] = useState<Cell[][][]>(() => Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0))));
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState(0);

  const reset = useCallback(() => { setBoards(Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0)))); setTurn(1); setWinner(0); }, []);

  const drop = (layer: number, col: number) => {
    if (winner) return;
    for (let row = SIZE - 1; row >= 0; row--) {
      if (boards[layer][row][col] === 0) {
        const nb = boards.map(l => l.map(r => [...r]));
        nb[layer][row][col] = turn;
        setBoards(nb); setTurn(turn === 1 ? 2 : 1);
        // Simple win check along each axis
        const check = (cells: Cell[]) => cells.length >= SIZE && cells.every(c => c === turn);
        // Check rows, cols, diags within each layer
        for (let l = 0; l < SIZE; l++) {
          for (let i = 0; i < SIZE; i++) {
            if (check(nb[l][i])) { setWinner(turn); return; }
            if (check(nb[l].map(r => r[i]))) { setWinner(turn); return; }
          }
        }
        return;
      }
    }
  };

  return (
    <GameLayout title="Four in a Row 3D" onRestart={reset} accentColor="orange" rules="Drop pieces into columns across 4 layers.\nConnect 4 in any direction to win!\nEach layer works like a separate Connect Four board." score={<div className="text-sm">{winner ? `P${winner} Wins!` : `Player ${turn}'s turn`}</div>}>
      {winner > 0 && <div className="text-xl font-display font-bold text-neon-orange mb-3 animate-scale-in">Player {winner} Wins! 🏆</div>}
      <div className="flex gap-4 flex-wrap justify-center">
        {boards.map((layer, li) => (
          <div key={li} className="border border-border rounded-lg p-2">
            <div className="text-xs text-muted-foreground text-center mb-1">Layer {li + 1}</div>
            <div className="flex gap-0.5 mb-1">{Array.from({ length: SIZE }, (_, c) => (
              <button key={c} onClick={() => drop(li, c)} className="w-8 h-4 rounded-t text-[10px] bg-muted/20 hover:bg-muted/40">↓</button>
            ))}</div>
            <div className="grid grid-cols-4 gap-0.5">
              {layer.flat().map((cell, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border ${cell === 1 ? 'bg-red-500 border-red-400' : cell === 2 ? 'bg-yellow-400 border-yellow-300' : 'bg-muted/20 border-border'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </GameLayout>
  );
};
export default FourInRow3DPage;
