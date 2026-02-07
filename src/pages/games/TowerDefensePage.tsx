import { useState, useEffect, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const PATH = [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[9,4],[9,3],[9,2],[9,1],[9,0]];
type Tower = { x: number; y: number; range: number; damage: number; cooldown: number; timer: number };
type Enemy = { pathIdx: number; hp: number; maxHp: number; };

const TowerDefensePage = () => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [gold, setGold] = useState(100);
  const [lives, setLives] = useState(10);
  const [wave, setWave] = useState(0);
  const [playing, setPlaying] = useState(false);

  const reset = useCallback(() => { setTowers([]); setEnemies([]); setGold(100); setLives(10); setWave(0); setPlaying(false); }, []);

  const placeTower = (r: number, c: number) => {
    if (gold < 25 || PATH.some(([pr, pc]) => pr === r && pc === c) || towers.some(t => t.x === c && t.y === r)) return;
    setTowers([...towers, { x: c, y: r, range: 2, damage: 1, cooldown: 10, timer: 0 }]);
    setGold(g => g - 25);
  };

  const startWave = () => {
    const count = 3 + wave * 2;
    const newEnemies = Array.from({ length: count }, () => ({ pathIdx: 0, hp: 3 + wave, maxHp: 3 + wave }));
    setEnemies(newEnemies); setWave(w => w + 1); setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    const loop = setInterval(() => {
      setEnemies(prev => {
        let ne = prev.map(e => ({ ...e, pathIdx: e.pathIdx + 0.1 }));
        // Tower attacks
        setTowers(ts => ts.map(t => {
          if (t.timer > 0) return { ...t, timer: t.timer - 1 };
          const target = ne.find(e => {
            if (e.hp <= 0) return false;
            const ep = PATH[Math.floor(e.pathIdx)] || PATH[PATH.length - 1];
            return Math.abs(ep[0] - t.y) + Math.abs(ep[1] - t.x) <= t.range;
          });
          if (target) { target.hp -= t.damage; if (target.hp <= 0) setGold(g => g + 10); return { ...t, timer: t.cooldown }; }
          return t;
        }));

        ne = ne.filter(e => {
          if (e.pathIdx >= PATH.length) { setLives(l => l - 1); return false; }
          return e.hp > 0;
        });

        if (ne.length === 0) setPlaying(false);
        return ne;
      });
    }, 100);
    return () => clearInterval(loop);
  }, [playing, towers]);

  return (
    <GameLayout title="Tower Defense" onRestart={reset} accentColor="orange" rules="Click empty cells to place towers (25 gold).\nTowers auto-attack enemies in range.\nDon't let enemies reach the end!\nEarn gold by destroying enemies." score={<div className="flex gap-4 text-sm"><span>Gold: {gold}</span><span>Lives: {lives}</span><span>Wave: {wave}</span></div>}>
      {lives <= 0 && <div className="text-xl font-display font-bold text-secondary mb-3 animate-scale-in">Game Over! Survived {wave} waves</div>}
      {!playing && lives > 0 && <button onClick={startWave} className="mb-3 px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange font-display hover:bg-neon-orange/30">Wave {wave + 1} 🌊</button>}
      <div className="grid grid-cols-10 gap-0.5">
        {Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => {
          const isPath = PATH.some(([pr, pc]) => pr === r && pc === c);
          const tower = towers.find(t => t.x === c && t.y === r);
          const enemy = enemies.find(e => { const p = PATH[Math.floor(e.pathIdx)]; return p && p[0] === r && p[1] === c && e.hp > 0; });
          return (
            <button key={`${r}-${c}`} onClick={() => !isPath && placeTower(r, c)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-sm transition-all
                ${isPath ? 'bg-muted/40' : 'bg-muted/10 hover:bg-muted/30 border border-border/20'}`}>
              {tower && '🗼'}{enemy && '👾'}{isPath && !enemy && <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />}
            </button>
          );
        }))}
      </div>
    </GameLayout>
  );
};
export default TowerDefensePage;
