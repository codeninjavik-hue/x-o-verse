import { useState, useEffect, useCallback, useRef } from 'react';
import GameLayout from '@/components/GameLayout';

const GRID = 5;

const WhackAMolePage = () => {
  const [moles, setMoles] = useState<boolean[]>(Array(GRID * GRID).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<number>(0);

  const start = useCallback(() => { setScore(0); setTimeLeft(30); setPlaying(true); setMoles(Array(GRID * GRID).fill(false)); }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setTimeLeft(t => { if (t <= 1) { setPlaying(false); return 0; } return t - 1; }), 1000);
    intervalRef.current = window.setInterval(() => {
      setMoles(prev => {
        const n = [...prev].map(() => false);
        const count = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) n[Math.floor(Math.random() * GRID * GRID)] = true;
        return n;
      });
    }, 800);
    return () => { clearInterval(timer); clearInterval(intervalRef.current); };
  }, [playing]);

  const whack = (i: number) => {
    if (!playing || !moles[i]) return;
    setScore(s => s + 1);
    setMoles(prev => { const n = [...prev]; n[i] = false; return n; });
  };

  return (
    <GameLayout title="Whack-a-Mole" onRestart={start} accentColor="purple" rules="Click the moles when they pop up!\n30 seconds to get the highest score.\nMoles appear randomly — be quick!" score={<div className="flex gap-4 text-sm"><span>Score: {score}</span><span>Time: {timeLeft}s</span></div>}>
      {!playing && timeLeft === 0 && <div className="text-2xl font-display font-bold text-accent mb-3 animate-scale-in">Time's Up! Score: {score}</div>}
      {!playing && timeLeft > 0 && <button onClick={start} className="mb-4 px-6 py-3 rounded-xl bg-accent/20 border border-accent text-accent font-display font-bold hover:bg-accent/30">Start Game!</button>}
      <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
        {moles.map((up, i) => (
          <button key={i} onClick={() => whack(i)}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center text-3xl transition-all duration-200
              ${up ? 'bg-neon-orange/30 border-neon-orange scale-110 animate-scale-in' : 'bg-muted/30 border-border'}`}>
            {up ? '🐹' : '🕳️'}
          </button>
        ))}
      </div>
    </GameLayout>
  );
};
export default WhackAMolePage;
