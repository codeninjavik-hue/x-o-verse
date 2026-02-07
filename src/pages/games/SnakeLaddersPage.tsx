import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SNAKES: Record<number, number> = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const LADDERS: Record<number, number> = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

const SnakeLaddersPage = () => {
  const [players, setPlayers] = useState([0, 0]);
  const [current, setCurrent] = useState(0);
  const [dice, setDice] = useState(0);
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const reset = useCallback(() => {
    setPlayers([0, 0]); setCurrent(0); setDice(0); setMessage(''); setWinner(null);
  }, []);

  const rollDice = () => {
    if (winner !== null || rolling) return;
    setRolling(true);
    const val = Math.floor(Math.random() * 6) + 1;
    setDice(val);

    setTimeout(() => {
      const newPos = players[current] + val;
      if (newPos > 100) { setMessage('Too high! Stay put.'); setCurrent(1 - current); setRolling(false); return; }

      let finalPos = newPos;
      let msg = '';
      if (SNAKES[newPos]) { finalPos = SNAKES[newPos]; msg = `🐍 Snake! Slide down to ${finalPos}`; }
      else if (LADDERS[newPos]) { finalPos = LADDERS[newPos]; msg = `🪜 Ladder! Climb to ${finalPos}`; }
      if (finalPos === 100) { setWinner(current); msg = '🏆 Winner!'; }

      const np = [...players]; np[current] = finalPos; setPlayers(np);
      setMessage(msg);
      if (finalPos !== 100) setCurrent(1 - current);
      setRolling(false);
    }, 500);
  };

  const getSquarePos = (num: number) => {
    const row = Math.floor((num - 1) / 10);
    const col = row % 2 === 0 ? (num - 1) % 10 : 9 - (num - 1) % 10;
    return { row: 9 - row, col };
  };

  return (
    <GameLayout title="Snake & Ladders" onRestart={reset} accentColor="orange"
      rules="Roll the dice and move your token.\n🐍 Land on a snake head → slide down.\n🪜 Land on a ladder bottom → climb up.\nFirst to reach 100 wins!\n\nPlayer 1 (🔴) vs Player 2 (🔵)">
      {winner !== null && <div className="text-2xl font-display font-bold text-neon-orange mb-4 animate-scale-in">Player {winner + 1} Wins! 🏆</div>}

      <div className="flex items-center gap-4 mb-4">
        <span className={`text-sm font-display ${current === 0 ? 'text-red-400' : 'text-blue-400'}`}>
          Player {current + 1}'s turn
        </span>
        <button onClick={rollDice} disabled={winner !== null || rolling}
          className="px-5 py-2 rounded-xl bg-neon-orange/20 border-2 border-neon-orange text-neon-orange font-display font-bold hover:bg-neon-orange/30 disabled:opacity-50 transition-all">
          🎲 {dice || '?'}
        </button>
      </div>
      {message && <div className="text-sm text-accent mb-2 animate-fade-in">{message}</div>}

      <div className="grid grid-cols-10 gap-0.5 w-full max-w-md">
        {Array.from({ length: 100 }, (_, i) => {
          const num = 100 - i;
          const row = Math.floor((num - 1) / 10);
          const displayCol = row % 2 === 0 ? (num - 1) % 10 : 9 - (num - 1) % 10;
          const actualNum = (9 - Math.floor(i / 10)) * 10 + (Math.floor(i / 10) % 2 === 0 ? (i % 10) + 1 : 10 - (i % 10));

          const isSnake = SNAKES[actualNum];
          const isLadder = LADDERS[actualNum];
          const p1Here = players[0] === actualNum;
          const p2Here = players[1] === actualNum;

          return (
            <div key={i} className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs rounded-sm relative
              ${isSnake ? 'bg-red-500/20' : isLadder ? 'bg-neon-green/20' : 'bg-muted/30'}
              border border-border/30`}>
              <span className="text-muted-foreground/50">{actualNum}</span>
              {isSnake && <span className="absolute text-sm">🐍</span>}
              {isLadder && <span className="absolute text-sm">🪜</span>}
              {p1Here && <span className="absolute text-lg">🔴</span>}
              {p2Here && <span className="absolute text-lg">🔵</span>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        <span className="text-red-400">🔴 P1: Square {players[0]}</span>
        <span className="text-blue-400">🔵 P2: Square {players[1]}</span>
      </div>
    </GameLayout>
  );
};

export default SnakeLaddersPage;
