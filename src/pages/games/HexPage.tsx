import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 7;
const HexPage = () => {
  const [cells, setCells] = useState<(0|1|2)[][]>(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
  const [turn, setTurn] = useState<1|2>(1);
  const [winner, setWinner] = useState(0);

  const reset = useCallback(() => { setCells(Array.from({ length: SIZE }, () => Array(SIZE).fill(0))); setTurn(1); setWinner(0); }, []);

  const checkWin = (board: (0|1|2)[][], player: 1|2): boolean => {
    const visited = new Set<string>();
    const queue: [number, number][] = [];
    if (player === 1) { for (let c = 0; c < SIZE; c++) if (board[0][c] === player) queue.push([0, c]); }
    else { for (let r = 0; r < SIZE; r++) if (board[r][0] === player) queue.push([r, 0]); }

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (visited.has(`${r}-${c}`)) continue; visited.add(`${r}-${c}`);
      if (player === 1 && r === SIZE - 1) return true;
      if (player === 2 && c === SIZE - 1) return true;
      [[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === player && !visited.has(`${nr}-${nc}`))
          queue.push([nr, nc]);
      });
    }
    return false;
  };

  const play = (r: number, c: number) => {
    if (winner || cells[r][c]) return;
    const nb = cells.map(row => [...row]); nb[r][c] = turn; setCells(nb);
    if (checkWin(nb, turn)) setWinner(turn);
    else setTurn(turn === 1 ? 2 : 1);
  };

  return (
    <GameLayout title="Hex" onRestart={reset} accentColor="cyan" rules="Player 1 (🔴) connects top to bottom.\nPlayer 2 (🔵) connects left to right.\nClick hexagons to place your piece." score={<div className="text-sm">{winner ? `Player ${winner} Wins!` : `Player ${turn}'s turn`}</div>}>
      {winner > 0 && <div className="text-2xl font-display font-bold text-primary mb-3 animate-scale-in">Player {winner} Wins! 🏆</div>}
      <div className="flex flex-col items-center">
        {cells.map((row, r) => (
          <div key={r} className="flex gap-1" style={{ marginLeft: r * 16 }}>
            {row.map((cell, c) => (
              <button key={c} onClick={() => play(r, c)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all
                  ${cell === 1 ? 'bg-red-500 border-red-400' : cell === 2 ? 'bg-blue-500 border-blue-400' : 'bg-muted/30 border-border hover:bg-muted/60'}`} />
            ))}
          </div>
        ))}
      </div>
    </GameLayout>
  );
};
export default HexPage;
