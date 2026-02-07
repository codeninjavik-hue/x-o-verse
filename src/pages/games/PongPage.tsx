import { useRef, useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const PongPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState([0, 0]);
  const stateRef = useRef({ p1: 150, p2: 150, bx: 200, by: 150, bdx: 3, bdy: 2 });

  const reset = useCallback(() => { stateRef.current = { p1: 150, p2: 150, bx: 200, by: 150, bdx: 3, bdy: 2 }; setScores([0, 0]); }, []);

  useEffect(() => {
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    const W = 400, H = 300, PH = 60, PW = 8;
    const handler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'w' && s.p1 > 0) s.p1 -= 20;
      if (e.key === 's' && s.p1 < H - PH) s.p1 += 20;
      if (e.key === 'ArrowUp') { e.preventDefault(); s.p2 -= 20; if (s.p2 < 0) s.p2 = 0; }
      if (e.key === 'ArrowDown') { e.preventDefault(); s.p2 += 20; if (s.p2 > H - PH) s.p2 = H - PH; }
    };
    window.addEventListener('keydown', handler);

    const loop = setInterval(() => {
      const s = stateRef.current;
      s.bx += s.bdx; s.by += s.bdy;
      if (s.by <= 0 || s.by >= H) s.bdy = -s.bdy;
      if (s.bx <= PW + 5 && s.by >= s.p1 && s.by <= s.p1 + PH) s.bdx = Math.abs(s.bdx);
      if (s.bx >= W - PW - 5 && s.by >= s.p2 && s.by <= s.p2 + PH) s.bdx = -Math.abs(s.bdx);
      if (s.bx < 0) { setScores(p => [p[0], p[1] + 1]); s.bx = 200; s.by = 150; s.bdx = 3; }
      if (s.bx > W) { setScores(p => [p[0] + 1, p[1]]); s.bx = 200; s.by = 150; s.bdx = -3; }

      ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([5, 5]); ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#00ffff'; ctx.fillRect(2, s.p1, PW, PH);
      ctx.fillStyle = '#ff006e'; ctx.fillRect(W - PW - 2, s.p2, PW, PH);
      ctx.beginPath(); ctx.arc(s.bx, s.by, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    }, 16);

    return () => { clearInterval(loop); window.removeEventListener('keydown', handler); };
  }, []);

  return (
    <GameLayout title="Pong" onRestart={reset} accentColor="cyan" rules="Player 1: W/S keys\nPlayer 2: ↑/↓ keys\nFirst to 10 wins!" score={<div className="flex gap-4 text-sm"><span className="text-primary">P1: {scores[0]}</span><span className="text-secondary">P2: {scores[1]}</span></div>}>
      <canvas ref={canvasRef} width={400} height={300} className="border border-border rounded-lg" />
    </GameLayout>
  );
};
export default PongPage;
