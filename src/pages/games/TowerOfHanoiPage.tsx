import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const DISCS = 5;
const DISC_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];

const TowerOfHanoiPage = () => {
  const [pegs, setPegs] = useState<number[][]>([Array.from({ length: DISCS }, (_, i) => i), [], []]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const reset = useCallback(() => { setPegs([Array.from({ length: DISCS }, (_, i) => i), [], []]); setSelected(null); setMoves(0); }, []);

  const handlePeg = (pegIdx: number) => {
    if (selected === null) {
      if (pegs[pegIdx].length > 0) setSelected(pegIdx);
    } else {
      if (pegIdx === selected) { setSelected(null); return; }
      const disc = pegs[selected][0];
      const topDisc = pegs[pegIdx][0];
      if (topDisc !== undefined && disc > topDisc) { setSelected(null); return; }
      const np = pegs.map(p => [...p]);
      np[selected].shift();
      np[pegIdx].unshift(disc);
      setPegs(np); setSelected(null); setMoves(m => m + 1);
    }
  };

  const won = pegs[2].length === DISCS;

  return (
    <GameLayout title="Tower of Hanoi" onRestart={reset} accentColor="green"
      rules={`Move all ${DISCS} discs from the first peg to the last.\nOnly one disc at a time.\nA larger disc cannot go on a smaller one.\nMinimum moves: ${Math.pow(2, DISCS) - 1}`}
      score={<div className="text-sm">Moves: {moves} | Minimum: {Math.pow(2, DISCS) - 1}</div>}>
      {won && <div className="text-2xl font-display font-bold text-neon-green mb-3 animate-scale-in">🎉 Solved in {moves} moves!</div>}
      <div className="flex gap-4 sm:gap-8">
        {pegs.map((peg, pi) => (
          <button key={pi} onClick={() => handlePeg(pi)}
            className={`flex flex-col items-center justify-end w-28 sm:w-36 h-44 sm:h-52 rounded-xl border-2 p-2 transition-all
              ${selected === pi ? 'border-neon-green bg-neon-green/10' : 'border-border bg-muted/10 hover:border-primary/50'}`}>
            <div className="flex flex-col items-center gap-1 w-full">
              {peg.map((disc, di) => (
                <div key={di} className={`${DISC_COLORS[disc]} rounded-full h-4 sm:h-5 transition-all`}
                  style={{ width: `${40 + disc * 15}%` }} />
              ))}
            </div>
            <div className="w-full h-1 bg-muted-foreground/30 rounded mt-1" />
            <div className="text-xs text-muted-foreground mt-1">Peg {pi + 1}</div>
          </button>
        ))}
      </div>
    </GameLayout>
  );
};

export default TowerOfHanoiPage;
