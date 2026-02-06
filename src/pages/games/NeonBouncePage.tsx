import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface Platform {
  x: number;
  y: number;
  width: number;
  color: string;
  collected: boolean;
}

const COLORS = [
  'hsl(180, 100%, 50%)', // cyan
  'hsl(320, 100%, 60%)', // magenta
  'hsl(280, 100%, 65%)', // purple
  'hsl(150, 100%, 50%)', // green
  'hsl(30, 100%, 55%)',  // orange
];

const NeonBouncePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('neonBounceHighScore') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameRef = useRef<{
    ball: Ball;
    platforms: Platform[];
    animationId: number | null;
    score: number;
  } | null>(null);

  const CANVAS_W = 360;
  const CANVAS_H = 560;

  const createPlatforms = useCallback((): Platform[] => {
    const plats: Platform[] = [];
    for (let i = 0; i < 8; i++) {
      plats.push({
        x: Math.random() * (CANVAS_W - 80) + 10,
        y: CANVAS_H - 80 - i * 65,
        width: 60 + Math.random() * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        collected: false,
      });
    }
    return plats;
  }, []);

  const initGame = useCallback(() => {
    const ball: Ball = {
      x: CANVAS_W / 2,
      y: CANVAS_H - 50,
      vx: 0,
      vy: -5,
      radius: 8,
      color: COLORS[0],
      trail: [],
    };
    gameRef.current = {
      ball,
      platforms: createPlatforms(),
      animationId: null,
      score: 0,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, [createPlatforms]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const game = gameRef.current;
    if (!canvas || !ctx || !game) return;

    const { ball, platforms } = game;

    // Physics
    ball.vy += 0.15; // gravity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Trail
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 15) ball.trail.shift();

    // Wall bounce
    if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.vx = Math.abs(ball.vx); }
    if (ball.x + ball.radius > CANVAS_W) { ball.x = CANVAS_W - ball.radius; ball.vx = -Math.abs(ball.vx); }

    // Platform collision (only when falling)
    if (ball.vy > 0) {
      for (const plat of platforms) {
        if (plat.collected) continue;
        if (
          ball.y + ball.radius >= plat.y &&
          ball.y + ball.radius <= plat.y + 12 &&
          ball.x >= plat.x &&
          ball.x <= plat.x + plat.width
        ) {
          ball.vy = -(6 + Math.random() * 2);
          ball.vx = (ball.x - (plat.x + plat.width / 2)) * 0.08;
          ball.color = plat.color;
          if (!plat.collected) {
            plat.collected = true;
            game.score += 10;
            setScore(game.score);
          }
        }
      }
    }

    // Scroll platforms up when ball goes above middle
    if (ball.y < CANVAS_H / 2) {
      const diff = CANVAS_H / 2 - ball.y;
      ball.y = CANVAS_H / 2;
      for (const plat of platforms) {
        plat.y += diff;
      }
      // Remove off-screen platforms and add new ones
      for (let i = platforms.length - 1; i >= 0; i--) {
        if (platforms[i].y > CANVAS_H + 20) {
          platforms.splice(i, 1);
          platforms.unshift({
            x: Math.random() * (CANVAS_W - 80) + 10,
            y: -10 - Math.random() * 30,
            width: 50 + Math.random() * 50,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            collected: false,
          });
        }
      }
    }

    // Game over
    if (ball.y > CANVAS_H + 30) {
      setGameOver(true);
      setGameStarted(false);
      if (game.score > highScore) {
        setHighScore(game.score);
        localStorage.setItem('neonBounceHighScore', game.score.toString());
      }
      return;
    }

    // Draw
    ctx.fillStyle = 'hsl(222, 47%, 6%)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw trail
    ball.trail.forEach((t, i) => {
      const alpha = (i / ball.trail.length) * 0.4;
      ctx.beginPath();
      ctx.arc(t.x, t.y, ball.radius * (i / ball.trail.length), 0, Math.PI * 2);
      ctx.fillStyle = ball.color.replace(')', ` / ${alpha})`).replace('hsl(', 'hsla(');
      ctx.fill();
    });

    // Draw platforms
    for (const plat of platforms) {
      ctx.fillStyle = plat.collected ? 'hsl(222, 30%, 15%)' : plat.color;
      ctx.shadowColor = plat.collected ? 'transparent' : plat.color;
      ctx.shadowBlur = plat.collected ? 0 : 15;
      ctx.beginPath();
      ctx.roundRect(plat.x, plat.y, plat.width, 8, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw ball
    ctx.shadowColor = ball.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Score on canvas
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.3)';
    ctx.font = 'bold 48px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(game.score.toString(), CANVAS_W / 2, CANVAS_H / 2);

    game.animationId = requestAnimationFrame(gameLoop);
  }, [highScore]);

  // Touch / Mouse control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const x = (clientX - rect.left) * scaleX;
      if (gameRef.current) {
        const ball = gameRef.current.ball;
        ball.vx = (x - ball.x) * 0.05;
      }
    };

    const onMouse = (e: MouseEvent) => handleMove(e.clientX);
    const onTouch = (e: TouchEvent) => { e.preventDefault(); handleMove(e.touches[0].clientX); };

    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('touchmove', onTouch, { passive: false });

    return () => {
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('touchmove', onTouch);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameStarted && gameRef.current) {
      gameRef.current.animationId = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameRef.current?.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, [gameStarted, gameLoop]);

  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>

          <h1 className="text-xl sm:text-2xl font-display font-bold">
            <span className="neon-text">Neon</span>
            <span className="neon-text-magenta"> Bounce</span>
          </h1>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={initGame} title="Restart">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Link to="/">
              <Button variant="ghost" size="icon" title="Home">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scores */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Score</span>
            <p className="text-2xl font-display font-bold text-primary">{score}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted-foreground">Best</span>
            <p className="text-2xl font-display font-bold text-neon-orange">{highScore}</p>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <div className="relative rounded-xl border-2 border-border overflow-hidden" style={{ maxWidth: CANVAS_W }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full"
              style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }}
            />

            {/* Start / Game Over Overlay */}
            {!gameStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                {gameOver ? (
                  <>
                    <p className="text-2xl font-display font-bold text-secondary mb-2">Game Over!</p>
                    <p className="text-lg font-display text-primary mb-1">Score: {score}</p>
                    {score >= highScore && score > 0 && (
                      <p className="text-sm text-neon-green mb-4 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> New High Score!
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xl font-display font-bold text-foreground mb-2">Neon Bounce</p>
                )}
                <Button variant="neon" onClick={initGame}>
                  {gameOver ? 'Play Again' : 'Start Game'}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">Move mouse/finger to guide the ball</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeonBouncePage;
