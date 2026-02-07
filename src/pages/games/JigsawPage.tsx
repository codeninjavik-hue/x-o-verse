import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const GRID = 4;
const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500',
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-cyan-400', 'bg-orange-400'];

const JigsawPage = () => {
  const [pieces, setPieces] = useState<number[]>(() => {
    const arr = Array.from({ length: GRID * GRID }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const reset = useCallback(() => {
    const arr = Array.from({ length: GRID * GRID }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    setPieces(arr); setSelected(null); setMoves(0);
  }, []);

  const handleClick = (idx: number) => {
    if (selected === null) { setSelected(idx); return; }
    const np = [...pieces];
    [np[selected], np[idx]] = [np[idx], np[selected]];
    setPieces(np); setSelected(null); setMoves(m => m + 1);
  };

  const won = pieces.every((p, i) => p === i);

  return (
    <GameLayout title="Jigsaw Puzzle" onRestart={reset} accentColor="magenta"
      rules="Click two pieces to swap them.\nArrange all pieces in order (matching the pattern).\nThe number on each piece shows its correct position."
      score={<div className="text-sm">Moves: {moves}</div>}>
      {won && <div className="text-2xl font-display font-bold text-secondary mb-3 animate-scale-in">🎉 Puzzle Complete!</div>}
      <div className="grid grid-cols-4 gap-1 w-full max-w-xs">
        {pieces.map((piece, idx) => (
          <button key={idx} onClick={() => handleClick(idx)}
            className={`aspect-square rounded-lg flex items-center justify-center text-lg font-bold transition-all
              ${COLORS[piece]} ${selected === idx ? 'ring-2 ring-foreground scale-110' : 'hover:scale-105'}
              ${piece === idx ? 'opacity-90' : 'opacity-70'}`}>
            {piece + 1}
          </button>
        ))}
      </div>
    </GameLayout>
  );
};

export default JigsawPage;
