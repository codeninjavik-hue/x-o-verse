import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const AsteroidsPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const reset = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 400, H = 400;
    let x = W/2, y = H/2, angle = 0, vx = 0, vy = 0, s = 0;
    const bullets: {x:number;y:number;dx:number;dy:number;life:number}[] = [];
    const asteroids: {x:number;y:number;dx:number;dy:number;r:number}[] = [];
    for (let i = 0; i < 6; i++) asteroids.push({x:Math.random()*W,y:Math.random()*H,dx:(Math.random()-0.5)*2,dy:(Math.random()-0.5)*2,r:20+Math.random()*15});
    const keys = new Set<string>();

    const handler = (e: KeyboardEvent) => { keys.add(e.key); e.preventDefault(); };
    const handlerUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener('keydown', handler); window.addEventListener('keyup', handlerUp);

    const loop = setInterval(() => {
      if (keys.has('ArrowLeft')) angle -= 0.08;
      if (keys.has('ArrowRight')) angle += 0.08;
      if (keys.has('ArrowUp')) { vx += Math.cos(angle)*0.15; vy += Math.sin(angle)*0.15; }
      if (keys.has(' ') && bullets.length < 5) bullets.push({x,y,dx:Math.cos(angle)*6,dy:Math.sin(angle)*6,life:40});

      x = (x+vx+W)%W; y = (y+vy+H)%H; vx *= 0.99; vy *= 0.99;
      bullets.forEach(b => { b.x += b.dx; b.y += b.dy; b.life--; });
      asteroids.forEach(a => { a.x = (a.x+a.dx+W)%W; a.y = (a.y+a.dy+H)%H; });

      bullets.forEach(b => {
        asteroids.forEach((a, ai) => {
          if (Math.hypot(b.x-a.x,b.y-a.y) < a.r) {
            b.life = 0; s += 10; setScore(s);
            if (a.r > 15) { asteroids.push({x:a.x,y:a.y,dx:(Math.random()-0.5)*3,dy:(Math.random()-0.5)*3,r:a.r/2}); asteroids.push({x:a.x,y:a.y,dx:(Math.random()-0.5)*3,dy:(Math.random()-0.5)*3,r:a.r/2}); }
            asteroids.splice(ai, 1);
          }
        });
      });

      asteroids.forEach(a => { if (Math.hypot(x-a.x,y-a.y) < a.r + 8) { setGameOver(true); clearInterval(loop); } });

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-8, -7); ctx.lineTo(-8, 7); ctx.closePath();
      ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();

      bullets.filter(b => b.life > 0).forEach(b => { ctx.fillStyle = '#ff006e'; ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, Math.PI*2); ctx.fill(); });
      asteroids.forEach(a => { ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI*2); ctx.stroke(); });
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); window.removeEventListener('keyup', handlerUp); };
  }, []);

  return (
    <GameLayout title="Asteroids" onRestart={reset} accentColor="orange" rules="↑ to thrust, ← → to rotate, Space to shoot.\nDestroy all asteroids!\nLarger ones split into smaller pieces." score={<div className="text-sm">Score: {score}</div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-orange mb-3 animate-scale-in">Game Over! Score: {score}</div>}
      <canvas ref={canvasRef} width={400} height={400} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default AsteroidsPage;
