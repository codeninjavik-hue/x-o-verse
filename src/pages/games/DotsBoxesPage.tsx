import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 6;
type Line = { r1: number; c1: number; r2: number; c2: number };

const DotsBoxesPage = () => {
  const [lines, setLines] = useState<Set<string>>(new Set());
  const [boxes, setBoxes] = useState<Record<string, number>>({});
  const [turn, setTurn] = useState(1);
  const scores = [0, 0];
  Object.values(boxes).forEach(v => scores[v - 1]++);

  const reset = useCallback(() => { setLines(new Set()); setBoxes({}); setTurn(1); }, []);

  const lineKey = (r1: number, c1: number, r2: number, c2: number) => `${Math.min(r1,r2)},${Math.min(c1,c2)}-${Math.max(r1,r2)},${Math.max(c1,c2)}`;

  const addLine = (r1: number, c1: number, r2: number, c2: number) => {
    const key = lineKey(r1, c1, r2, c2);
    if (lines.has(key)) return;
    const nl = new Set(lines); nl.add(key);

    let scored = false;
    const nb = { ...boxes };
    // Check if this line completes any box
    const checkBox = (r: number, c: number) => {
      const top = lineKey(r, c, r, c + 1), bottom = lineKey(r + 1, c, r + 1, c + 1);
      const left = lineKey(r, c, r + 1, c), right = lineKey(r, c + 1, r + 1, c + 1);
      if (nl.has(top) && nl.has(bottom) && nl.has(left) && nl.has(right) && !nb[`${r},${c}`]) {
        nb[`${r},${c}`] = turn; scored = true;
      }
    };

    for (let r = 0; r < SIZE - 1; r++) for (let c = 0; c < SIZE - 1; c++) checkBox(r, c);
    setLines(nl); setBoxes(nb);
    if (!scored) setTurn(turn === 1 ? 2 : 1);
  };

  const totalBoxes = (SIZE - 1) * (SIZE - 1);
  const gameOver = Object.keys(boxes).length === totalBoxes;

  return (
    <GameLayout title="Dots & Boxes" onRestart={reset} accentColor="magenta" rules="Click between dots to draw a line.\nComplete a box to score and get another turn.\nThe player with the most boxes wins!" score={<div className="flex gap-4 text-sm"><span className="text-primary">P1: {scores[0]}</span><span className="text-secondary">P2: {scores[1]}</span></div>}>
      {gameOver && <div className="text-xl font-display font-bold text-secondary mb-3 animate-scale-in">{scores[0] > scores[1] ? 'P1 Wins!' : 'P2 Wins!'} 🏆</div>}
      <div className="text-sm text-muted-foreground mb-2">Player {turn}'s turn</div>
      <div className="relative" style={{ width: SIZE * 40, height: SIZE * 40 }}>
        {Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => (
          <div key={`d${r}-${c}`} className="absolute w-3 h-3 rounded-full bg-foreground" style={{ left: c * 40 - 5, top: r * 40 - 5 }} />
        )))}
        {Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE - 1 }, (_, c) => {
          const key = lineKey(r, c, r, c + 1);
          return <button key={`h${r}-${c}`} onClick={() => addLine(r, c, r, c + 1)} className={`absolute h-2 rounded ${lines.has(key) ? 'bg-primary' : 'bg-muted/20 hover:bg-primary/40'}`} style={{ left: c * 40 + 5, top: r * 40 - 3, width: 30 }} />;
        }))}
        {Array.from({ length: SIZE - 1 }, (_, r) => Array.from({ length: SIZE }, (_, c) => {
          const key = lineKey(r, c, r + 1, c);
          return <button key={`v${r}-${c}`} onClick={() => addLine(r, c, r + 1, c)} className={`absolute w-2 rounded ${lines.has(key) ? 'bg-primary' : 'bg-muted/20 hover:bg-primary/40'}`} style={{ left: c * 40 - 3, top: r * 40 + 5, height: 30 }} />;
        }))}
        {Object.entries(boxes).map(([key, player]) => {
          const [r, c] = key.split(',').map(Number);
          return <div key={key} className={`absolute rounded text-xs flex items-center justify-center font-bold ${player === 1 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`} style={{ left: c * 40 + 5, top: r * 40 + 5, width: 30, height: 30 }}>P{player}</div>;
        })}
      </div>
    </GameLayout>
  );
};
export default DotsBoxesPage;
