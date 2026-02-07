import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const NimPage = () => {
  const [piles, setPiles] = useState([3, 5, 7]);
  const [turn, setTurn] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => { setPiles([3, 5, 7]); setTurn(0); setGameOver(false); }, []);

  const take = (pile: number, count: number) => {
    if (gameOver || piles[pile] < count) return;
    const np = [...piles]; np[pile] -= count;
    setPiles(np);
    if (np.every(p => p === 0)) { setGameOver(true); return; }
    setTurn(1 - turn);
    if (turn === 0) {
      setTimeout(() => {
        const nnp = [...np];
        const nonEmpty = nnp.map((v, i) => ({ v, i })).filter(x => x.v > 0);
        if (nonEmpty.length > 0) {
          const pile = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
          const take = 1 + Math.floor(Math.random() * pile.v);
          nnp[pile.i] -= take;
          setPiles(nnp);
          if (nnp.every(p => p === 0)) setGameOver(true);
          else setTurn(0);
        }
      }, 600);
    }
  };

  return (
    <GameLayout title="Nim" onRestart={reset} accentColor="green" rules="Take any number of objects from one pile.\nThe player who takes the last object LOSES.\nOutsmart the AI!" score={<div className="text-sm">{gameOver ? (turn === 0 ? 'AI Wins!' : 'You Win!') : `${turn === 0 ? 'Your' : "AI's"} turn`}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-green mb-3 animate-scale-in">{turn === 0 ? 'AI Wins! 💀' : 'You Win! 🏆'}</div>}
      <div className="flex gap-8">
        {piles.map((count, pi) => (
          <div key={pi} className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">Pile {pi + 1}</div>
            <div className="flex flex-col gap-1">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="w-8 h-4 rounded bg-neon-green/60 border border-neon-green" />
              ))}
              {count === 0 && <div className="text-muted-foreground text-xs">Empty</div>}
            </div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => take(pi, n)} disabled={gameOver || turn !== 0 || piles[pi] < n}
                  className="w-8 h-8 rounded bg-muted/30 border border-border text-xs font-bold hover:bg-neon-green/20 disabled:opacity-30">{n}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GameLayout>
  );
};
export default NimPage;
