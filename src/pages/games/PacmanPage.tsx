import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const PacmanPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef('right');
  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const SIZE = 20, CELL = 20, W = SIZE * CELL;
    const walls = new Set<string>();
    const dots = new Set<string>();

    // Generate maze-like walls
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (r === 0 || r === SIZE-1 || c === 0 || c === SIZE-1) walls.add(`${r}-${c}`);
      else if (r % 2 === 0 && c % 2 === 0 && Math.random() > 0.3) walls.add(`${r}-${c}`);
      else if (!walls.has(`${r}-${c}`)) dots.add(`${r}-${c}`);
    }

    let px = 1, py = 1; dots.delete('1-1');
    let ghosts = [{x:18,y:1,dx:0,dy:1},{x:1,y:18,dx:1,dy:0},{x:18,y:18,dx:-1,dy:0}];
    let s = 0;

    const handler = (e: KeyboardEvent) => {
      const map: Record<string,string> = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
      if (map[e.key]) { e.preventDefault(); dirRef.current = map[e.key]; }
    };
    window.addEventListener('keydown', handler);

    const loop = setInterval(() => {
      let nx = px, ny = py;
      if (dirRef.current === 'up') ny--; else if (dirRef.current === 'down') ny++;
      else if (dirRef.current === 'left') nx--; else nx++;
      if (!walls.has(`${ny}-${nx}`)) { px = nx; py = ny; }

      if (dots.has(`${py}-${px}`)) { dots.delete(`${py}-${px}`); s += 10; setScore(s); }

      ghosts.forEach(g => {
        let gnx = g.x + g.dx, gny = g.y + g.dy;
        if (walls.has(`${gny}-${gnx}`) || gnx < 0 || gnx >= SIZE || gny < 0 || gny >= SIZE) {
          const dirs = [[0,1],[0,-1],[1,0],[-1,0]].filter(([dx,dy]) => !walls.has(`${g.y+dy}-${g.x+dx}`));
          if (dirs.length > 0) { const d = dirs[Math.floor(Math.random()*dirs.length)]; g.dx = d[0]; g.dy = d[1]; }
        } else { g.x = gnx; g.y = gny; }
        if (g.x === px && g.y === py) { setGameOver(true); clearInterval(loop); }
      });

      if (dots.size === 0) { setGameOver(true); clearInterval(loop); }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, W);
      walls.forEach(w => { const [r,c] = w.split('-').map(Number); ctx.fillStyle = '#1a1a3e'; ctx.fillRect(c*CELL, r*CELL, CELL, CELL); });
      dots.forEach(d => { const [r,c] = d.split('-').map(Number); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(c*CELL+CELL/2, r*CELL+CELL/2, 2, 0, Math.PI*2); ctx.fill(); });
      ctx.fillStyle = '#ffff00'; ctx.beginPath(); ctx.arc(px*CELL+CELL/2, py*CELL+CELL/2, 8, 0.2*Math.PI, 1.8*Math.PI); ctx.lineTo(px*CELL+CELL/2, py*CELL+CELL/2); ctx.fill();
      ghosts.forEach((g, i) => { ctx.fillStyle = ['#ff0000','#ff69b4','#00bfff'][i]; ctx.beginPath(); ctx.arc(g.x*CELL+CELL/2, g.y*CELL+CELL/2, 7, 0, Math.PI*2); ctx.fill(); });
    }, 150);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, []);

  return (
    <GameLayout title="Pac-Man" onRestart={reset} accentColor="cyan" rules="Arrow keys to move.\nEat all dots.\nAvoid the ghosts!" score={<div className="text-sm">Score: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-primary mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <canvas ref={canvasRef} width={400} height={400} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default PacmanPage;
