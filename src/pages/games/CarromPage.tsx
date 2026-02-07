import { useState, useRef, useEffect, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

interface Coin { x: number; y: number; vx: number; vy: number; type: 'black' | 'white' | 'queen'; pocketed: boolean; }

const CarromPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState([0, 0]);
  const [turn, setTurn] = useState(0);
  const [aiming, setAiming] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const coinsRef = useRef<Coin[]>([]);
  const strikerRef = useRef({ x: 200, y: 340, vx: 0, vy: 0 });
  const animatingRef = useRef(false);

  const SIZE = 400;
  const POCKET_R = 18;
  const COIN_R = 10;
  const STRIKER_R = 14;
  const FRICTION = 0.97;

  const initCoins = useCallback(() => {
    const coins: Coin[] = [];
    const cx = SIZE / 2, cy = SIZE / 2;
    coins.push({ x: cx, y: cy, vx: 0, vy: 0, type: 'queen', pocketed: false });
    const offsets = [[-20,-20],[20,-20],[-20,20],[20,20],[0,-30],[0,30],[-30,0],[30,0],[-15,0],[15,0],[0,-15],[0,15]];
    offsets.forEach((o, i) => {
      coins.push({ x: cx + o[0], y: cy + o[1], vx: 0, vy: 0, type: i < 6 ? 'black' : 'white', pocketed: false });
    });
    coinsRef.current = coins;
    strikerRef.current = { x: SIZE / 2, y: 340, vx: 0, vy: 0 };
  }, []);

  const reset = useCallback(() => {
    initCoins(); setScores([0, 0]); setTurn(0); setGameOver(false); setAiming(false);
  }, [initCoins]);

  useEffect(() => { initCoins(); }, [initCoins]);

  const shoot = () => {
    if (animatingRef.current || gameOver) return;
    const s = strikerRef.current;
    const rad = (aimAngle * Math.PI) / 180;
    const speed = power * 0.15;
    s.vx = Math.cos(rad) * speed;
    s.vy = Math.sin(rad) * speed;
    animatingRef.current = true;
    setAiming(false);
    animate();
  };

  const animate = () => {
    const s = strikerRef.current;
    const coins = coinsRef.current;
    let moving = true;

    const step = () => {
      s.x += s.vx; s.y += s.vy;
      s.vx *= FRICTION; s.vy *= FRICTION;

      // Walls
      if (s.x < STRIKER_R) { s.x = STRIKER_R; s.vx = -s.vx * 0.8; }
      if (s.x > SIZE - STRIKER_R) { s.x = SIZE - STRIKER_R; s.vx = -s.vx * 0.8; }
      if (s.y < STRIKER_R) { s.y = STRIKER_R; s.vy = -s.vy * 0.8; }
      if (s.y > SIZE - STRIKER_R) { s.y = SIZE - STRIKER_R; s.vy = -s.vy * 0.8; }

      coins.forEach(coin => {
        if (coin.pocketed) return;
        coin.x += coin.vx; coin.y += coin.vy;
        coin.vx *= FRICTION; coin.vy *= FRICTION;
        if (coin.x < COIN_R) { coin.x = COIN_R; coin.vx = -coin.vx * 0.8; }
        if (coin.x > SIZE - COIN_R) { coin.x = SIZE - COIN_R; coin.vx = -coin.vx * 0.8; }
        if (coin.y < COIN_R) { coin.y = COIN_R; coin.vy = -coin.vy * 0.8; }
        if (coin.y > SIZE - COIN_R) { coin.y = SIZE - COIN_R; coin.vy = -coin.vy * 0.8; }

        // Collision with striker
        const dx = coin.x - s.x, dy = coin.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < COIN_R + STRIKER_R && dist > 0) {
          const nx = dx / dist, ny = dy / dist;
          coin.vx += nx * 5; coin.vy += ny * 5;
          s.vx -= nx * 2; s.vy -= ny * 2;
          coin.x = s.x + nx * (COIN_R + STRIKER_R + 1);
          coin.y = s.y + ny * (COIN_R + STRIKER_R + 1);
        }

        // Pockets
        const pockets = [[0, 0], [SIZE, 0], [0, SIZE], [SIZE, SIZE]];
        pockets.forEach(([px, py]) => {
          const pd = Math.sqrt((coin.x - px) ** 2 + (coin.y - py) ** 2);
          if (pd < POCKET_R) {
            coin.pocketed = true; coin.vx = 0; coin.vy = 0;
            setScores(prev => {
              const ns = [...prev];
              ns[turn] += coin.type === 'queen' ? 3 : 1;
              return ns;
            });
          }
        });
      });

      // Coin-coin collisions
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].pocketed) continue;
        for (let j = i + 1; j < coins.length; j++) {
          if (coins[j].pocketed) continue;
          const dx = coins[j].x - coins[i].x, dy = coins[j].y - coins[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < COIN_R * 2 && dist > 0) {
            const nx = dx / dist, ny = dy / dist;
            const dvx = coins[i].vx - coins[j].vx, dvy = coins[i].vy - coins[j].vy;
            const dvn = dvx * nx + dvy * ny;
            if (dvn > 0) {
              coins[i].vx -= dvn * nx; coins[i].vy -= dvn * ny;
              coins[j].vx += dvn * nx; coins[j].vy += dvn * ny;
            }
          }
        }
      }

      const totalSpeed = Math.abs(s.vx) + Math.abs(s.vy) + coins.reduce((sum, c) => sum + Math.abs(c.vx) + Math.abs(c.vy), 0);
      if (totalSpeed < 0.1) {
        animatingRef.current = false;
        s.vx = 0; s.vy = 0;
        coins.forEach(c => { c.vx = 0; c.vy = 0; });
        s.x = SIZE / 2; s.y = turn === 0 ? 340 : 60;
        setTurn(t => 1 - t);
        const remaining = coins.filter(c => !c.pocketed);
        if (remaining.length === 0) setGameOver(true);
        return;
      }

      draw();
      requestAnimationFrame(step);
    };
    step();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Board
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, SIZE - 20, SIZE - 20);

    // Pockets
    [[0, 0], [SIZE, 0], [0, SIZE], [SIZE, SIZE]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.arc(x, y, POCKET_R, 0, Math.PI * 2);
      ctx.fillStyle = '#000'; ctx.fill();
      ctx.strokeStyle = '#00ffff33'; ctx.stroke();
    });

    // Coins
    coinsRef.current.forEach(coin => {
      if (coin.pocketed) return;
      ctx.beginPath(); ctx.arc(coin.x, coin.y, COIN_R, 0, Math.PI * 2);
      ctx.fillStyle = coin.type === 'queen' ? '#ff006e' : coin.type === 'black' ? '#222' : '#eee';
      ctx.fill(); ctx.strokeStyle = coin.type === 'queen' ? '#ff006e88' : '#55555588'; ctx.stroke();
    });

    // Striker
    const s = strikerRef.current;
    ctx.beginPath(); ctx.arc(s.x, s.y, STRIKER_R, 0, Math.PI * 2);
    ctx.fillStyle = '#00ffff44'; ctx.fill();
    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2; ctx.stroke();

    // Aim line
    if (aiming) {
      const rad = (aimAngle * Math.PI) / 180;
      ctx.beginPath(); ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + Math.cos(rad) * power, s.y + Math.sin(rad) * power);
      ctx.strokeStyle = '#00ffff66'; ctx.lineWidth = 2; ctx.stroke();
    }
  }, [aiming, aimAngle, power]);

  useEffect(() => { draw(); }, [draw, turn, scores]);

  return (
    <GameLayout title="Carrom Board" onRestart={reset} accentColor="cyan"
      rules="Aim and shoot the striker to pocket coins.\nBlack & white coins = 1 point.\nQueen (pink) = 3 points.\nUse angle and power controls to aim.\nPlayers alternate turns."
      score={<div className="flex gap-6 text-sm font-display"><span className="text-primary">P1: {scores[0]}</span><span className="text-secondary">P2: {scores[1]}</span></div>}>
      {gameOver && <div className="text-2xl font-display font-bold text-primary mb-4 animate-scale-in">Game Over! {scores[0] > scores[1] ? 'P1' : 'P2'} Wins! 🏆</div>}
      <div className="text-sm text-muted-foreground mb-2">Player {turn + 1}'s turn</div>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className="border border-border rounded-lg mb-4" />
      <div className="flex flex-col gap-2 items-center w-full max-w-xs">
        <label className="text-xs text-muted-foreground">Angle: {aimAngle}°</label>
        <input type="range" min={-180} max={0} value={aimAngle} onChange={e => { setAimAngle(+e.target.value); setAiming(true); draw(); }}
          className="w-full accent-primary" />
        <label className="text-xs text-muted-foreground">Power: {power}%</label>
        <input type="range" min={20} max={100} value={power} onChange={e => { setPower(+e.target.value); setAiming(true); draw(); }}
          className="w-full accent-secondary" />
        <button onClick={shoot} disabled={animatingRef.current || gameOver}
          className="px-6 py-2 rounded-lg bg-primary/20 border border-primary text-primary font-display hover:bg-primary/30 disabled:opacity-50">
          Shoot! 🎯
        </button>
      </div>
    </GameLayout>
  );
};

export default CarromPage;
