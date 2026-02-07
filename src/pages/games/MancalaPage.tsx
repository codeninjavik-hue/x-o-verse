import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const MancalaPage = () => {
  const [pits, setPits] = useState<number[]>([4,4,4,4,4,4, 0, 4,4,4,4,4,4, 0]);
  const [turn, setTurn] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => { setPits([4,4,4,4,4,4, 0, 4,4,4,4,4,4, 0]); setTurn(0); setGameOver(false); }, []);

  const sow = (pit: number) => {
    if (gameOver) return;
    if (turn === 0 && (pit < 0 || pit > 5)) return;
    if (turn === 1 && (pit < 7 || pit > 12)) return;
    if (pits[pit] === 0) return;

    const np = [...pits];
    let seeds = np[pit];
    np[pit] = 0;
    let idx = pit;
    const skipStore = turn === 0 ? 13 : 6;

    while (seeds > 0) {
      idx = (idx + 1) % 14;
      if (idx === skipStore) continue;
      np[idx]++;
      seeds--;
    }

    // Capture
    const myStore = turn === 0 ? 6 : 13;
    if (idx !== myStore) {
      const myRange = turn === 0 ? [0, 5] : [7, 12];
      if (idx >= myRange[0] && idx <= myRange[1] && np[idx] === 1) {
        const opposite = 12 - idx;
        if (np[opposite] > 0) {
          np[myStore] += np[opposite] + 1;
          np[opposite] = 0; np[idx] = 0;
        }
      }
    }

    // Check game over
    const side1 = np.slice(0, 6).reduce((a, b) => a + b, 0);
    const side2 = np.slice(7, 13).reduce((a, b) => a + b, 0);
    if (side1 === 0 || side2 === 0) {
      np[6] += side1; np[13] += side2;
      for (let i = 0; i < 6; i++) np[i] = 0;
      for (let i = 7; i < 13; i++) np[i] = 0;
      setGameOver(true);
    }

    setPits(np);
    if (idx !== myStore) setTurn(1 - turn);
  };

  return (
    <GameLayout title="Mancala" onRestart={reset} accentColor="purple"
      rules="Click a pit on your side to sow seeds counter-clockwise.\nLanding in your store (big pit) gives an extra turn.\nLanding in an empty pit on your side captures opposite pit's seeds.\nThe player with the most seeds in their store wins!"
      score={<div className="flex gap-6 text-sm"><span className="text-primary">P1 Store: {pits[6]}</span><span className="text-secondary">P2 Store: {pits[13]}</span></div>}>
      {gameOver && <div className="text-2xl font-display font-bold text-accent mb-4 animate-scale-in">{pits[6] > pits[13] ? 'Player 1 Wins!' : pits[13] > pits[6] ? 'Player 2 Wins!' : 'Draw!'} 🏆</div>}
      <div className="text-sm text-muted-foreground mb-2">{!gameOver && `Player ${turn + 1}'s turn`}</div>

      <div className="flex items-center gap-2">
        <div className="w-16 h-32 rounded-xl bg-accent/20 border border-border flex items-center justify-center text-2xl font-bold text-accent">{pits[13]}</div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {[12,11,10,9,8,7].map(i => (
              <button key={i} onClick={() => sow(i)} disabled={turn !== 1 || pits[i] === 0 || gameOver}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/20 border border-border flex items-center justify-center text-lg font-bold
                  hover:bg-secondary/30 disabled:opacity-40 transition-all text-secondary">{pits[i]}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {[0,1,2,3,4,5].map(i => (
              <button key={i} onClick={() => sow(i)} disabled={turn !== 0 || pits[i] === 0 || gameOver}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 border border-border flex items-center justify-center text-lg font-bold
                  hover:bg-primary/30 disabled:opacity-40 transition-all text-primary">{pits[i]}</button>
            ))}
          </div>
        </div>
        <div className="w-16 h-32 rounded-xl bg-primary/20 border border-border flex items-center justify-center text-2xl font-bold text-primary">{pits[6]}</div>
      </div>
    </GameLayout>
  );
};

export default MancalaPage;
