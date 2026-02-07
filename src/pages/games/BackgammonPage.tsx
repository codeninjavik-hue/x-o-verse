import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const initPoints = (): number[][] => {
  const pts: number[][] = Array.from({ length: 24 }, () => []);
  // Player 1 (positive), Player 2 (negative)
  [0,0].forEach(() => pts[0].push(1)); [0,0,0,0,0].forEach(() => pts[11].push(1));
  [0,0,0].forEach(() => pts[16].push(1)); [0,0,0,0,0].forEach(() => pts[18].push(1));
  [0,0].forEach(() => pts[23].push(2)); [0,0,0,0,0].forEach(() => pts[12].push(2));
  [0,0,0].forEach(() => pts[7].push(2)); [0,0,0,0,0].forEach(() => pts[5].push(2));
  return pts;
};

const BackgammonPage = () => {
  const [points, setPoints] = useState(initPoints);
  const [turn, setTurn] = useState(1);
  const [dice, setDice] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [borne, setBorne] = useState({ 1: 0, 2: 0 });

  const reset = useCallback(() => { setPoints(initPoints()); setTurn(1); setDice([]); setSelected(null); setBorne({ 1: 0, 2: 0 }); }, []);

  const rollDice = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice(d1 === d2 ? [d1, d1, d1, d1] : [d1, d2]);
  };

  const canMove = (from: number, steps: number) => {
    const to = turn === 1 ? from + steps : from - steps;
    if (to < 0 || to > 23) return true; // bearing off simplified
    const dest = points[to];
    return dest.length === 0 || dest[0] === turn || dest.length === 1;
  };

  const move = (from: number, dieIdx: number) => {
    if (dice.length === 0) return;
    const steps = dice[dieIdx];
    if (!canMove(from, steps)) return;

    const np = points.map(p => [...p]);
    np[from].pop();
    const to = turn === 1 ? from + steps : from - steps;

    if (to >= 0 && to <= 23) {
      if (np[to].length === 1 && np[to][0] !== turn) np[to] = [turn]; // hit
      else np[to].push(turn);
    } else {
      setBorne(prev => ({ ...prev, [turn]: prev[turn as keyof typeof prev] + 1 }));
    }

    const nd = [...dice]; nd.splice(dieIdx, 1);
    setPoints(np); setDice(nd); setSelected(null);
    if (nd.length === 0) { setTurn(turn === 1 ? 2 : 1); }
  };

  const winner = borne[1] >= 15 ? 'Player 1' : borne[2] >= 15 ? 'Player 2' : '';

  return (
    <GameLayout title="Backgammon" onRestart={reset} accentColor="cyan"
      rules="Roll dice and move your checkers.\nPlayer 1 moves right (→), Player 2 moves left (←).\nClick a point with your pieces, then use a die value to move.\nBear off all 15 checkers to win!"
      score={<div className="flex gap-4 text-sm"><span className="text-primary">P1 Home: {borne[1]}</span><span className="text-secondary">P2 Home: {borne[2]}</span></div>}>
      {winner && <div className="text-2xl font-display font-bold text-primary mb-4 animate-scale-in">{winner} Wins! 🏆</div>}

      <div className="flex items-center gap-3 mb-4">
        <span className={`text-sm ${turn === 1 ? 'text-primary' : 'text-secondary'}`}>P{turn}'s turn</span>
        {dice.length === 0 && !winner && (
          <button onClick={rollDice} className="px-4 py-2 rounded-lg bg-primary/20 border border-primary text-primary font-display hover:bg-primary/30">Roll 🎲</button>
        )}
        {dice.length > 0 && <div className="flex gap-2">{dice.map((d, i) => (
          <span key={i} className="px-3 py-1 rounded bg-muted border border-border font-bold">{d}</span>
        ))}</div>}
      </div>

      <div className="flex gap-0.5 mb-1">
        {points.slice(0, 12).map((pt, i) => (
          <button key={i} onClick={() => { if (pt.length > 0 && pt[0] === turn && dice.length > 0) { setSelected(i); move(i, 0); } }}
            className={`w-8 h-24 sm:w-10 sm:h-28 rounded-t-lg border border-border/30 flex flex-col-reverse items-center gap-0.5 p-1
              ${i % 2 === 0 ? 'bg-muted/40' : 'bg-muted/20'} ${selected === i ? 'ring-1 ring-primary' : ''} hover:bg-muted/60 transition-all`}>
            {pt.slice(0, 5).map((p, j) => (
              <div key={j} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${p === 1 ? 'bg-primary/80' : 'bg-secondary/80'}`} />
            ))}
            {pt.length > 5 && <span className="text-[9px]">+{pt.length - 5}</span>}
          </button>
        ))}
      </div>
      <div className="flex gap-0.5">
        {points.slice(12, 24).reverse().map((pt, i) => (
          <button key={i + 12} onClick={() => { const idx = 23 - i; if (pt.length > 0 && pt[0] === turn && dice.length > 0) { setSelected(idx); move(idx, 0); } }}
            className={`w-8 h-24 sm:w-10 sm:h-28 rounded-b-lg border border-border/30 flex flex-col items-center gap-0.5 p-1
              ${i % 2 === 0 ? 'bg-muted/40' : 'bg-muted/20'} hover:bg-muted/60 transition-all`}>
            {pt.slice(0, 5).map((p, j) => (
              <div key={j} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${p === 1 ? 'bg-primary/80' : 'bg-secondary/80'}`} />
            ))}
            {pt.length > 5 && <span className="text-[9px]">+{pt.length - 5}</span>}
          </button>
        ))}
      </div>
    </GameLayout>
  );
};

export default BackgammonPage;
