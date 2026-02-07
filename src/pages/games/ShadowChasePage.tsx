import { useState, useEffect, useCallback, useRef } from 'react';
import GameLayout from '@/components/GameLayout';

const SIZE = 12;

const ShadowChasePage = () => {
  const [player, setPlayer] = useState({ r: 1, c: 1 });
  const [shadow, setShadow] = useState({ r: SIZE - 2, c: SIZE - 2 });
  const [trail, setTrail] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (let i = 0; i < 15; i++) s.add(`${1 + Math.floor(Math.random() * (SIZE - 2))}-${1 + Math.floor(Math.random() * (SIZE - 2))}`);
    return s;
  });
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameOver) return;
      const map: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const dir = map[e.key];
      if (!dir) return; e.preventDefault();
      const nr = player.r + dir[0], nc = player.c + dir[1];
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        setPlayer({ r: nr, c: nc });
        setTrail(t => [...t.slice(-20), `${nr}-${nc}`]);
        const key = `${nr}-${nc}`;
        if (coins.has(key)) { setCoins(prev => { const n = new Set(prev); n.delete(key); return n; }); setScore(s => s + 10); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [player, gameOver, coins]);

  // Shadow follows player with delay
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setShadow(prev => {
        const dr = player.r > prev.r ? 1 : player.r < prev.r ? -1 : 0;
        const dc = player.c > prev.c ? 1 : player.c < prev.c ? -1 : 0;
        const nr = prev.r + dr, nc = prev.c + dc;
        if (nr === player.r && nc === player.c) { setGameOver(true); }
        return { r: nr, c: nc };
      });
    }, 400);
    return () => clearInterval(interval);
  }, [player, gameOver]);

  return (
    <GameLayout title="Shadow Chase" onRestart={reset} accentColor="purple" rules="Arrow keys to move.\nCollect coins (⭐) for points.\nThe shadow follows you — don't get caught!\nOutsmart it to survive!" score={<div className="text-sm">Score: {score} | Coins: {coins.size}</div>}>
      {gameOver && <div className="text-2xl font-display font-bold text-accent mb-3 animate-scale-in">Caught! Score: {score} 💀</div>}
      {coins.size === 0 && !gameOver && <div className="text-2xl font-display font-bold text-accent mb-3 animate-scale-in">All Coins! Score: {score} 🏆</div>}
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => {
          const isPlayer = player.r === r && player.c === c;
          const isShadow = shadow.r === r && shadow.c === c;
          const isCoin = coins.has(`${r}-${c}`);
          const isTrail = trail.includes(`${r}-${c}`);
          return (
            <div key={`${r}-${c}`} className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm transition-all
              ${isPlayer ? 'bg-accent/50' : isShadow ? 'bg-purple-900/80' : isTrail ? 'bg-accent/10' : 'bg-muted/5'}`}>
              {isPlayer ? '😎' : isShadow ? '👤' : isCoin ? '⭐' : ''}
            </div>
          );
        }))}
      </div>
    </GameLayout>
  );
};
export default ShadowChasePage;
