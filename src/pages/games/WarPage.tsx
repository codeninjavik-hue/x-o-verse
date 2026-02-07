import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♠','♥','♦','♣'], RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const isRed = (c: string) => c.endsWith('♥') || c.endsWith('♦');
const rankVal = (c: string) => RANKS.indexOf(c.slice(0, -1));

const createDeck = () => {
  const d: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => d.push(`${r}${s}`)));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

const WarPage = () => {
  const [p1, setP1] = useState<string[]>([]);
  const [p2, setP2] = useState<string[]>([]);
  const [p1Card, setP1Card] = useState('');
  const [p2Card, setP2Card] = useState('');
  const [message, setMessage] = useState('Click to battle!');
  const [gameOver, setGameOver] = useState(false);

  const init = useCallback(() => {
    const d = createDeck();
    setP1(d.slice(0, 26)); setP2(d.slice(26)); setP1Card(''); setP2Card(''); setMessage('Click to battle!'); setGameOver(false);
  }, []);

  useState(() => { init(); });

  const battle = () => {
    if (gameOver || p1.length === 0 || p2.length === 0) return;
    const c1 = p1[0], c2 = p2[0];
    setP1Card(c1); setP2Card(c2);
    const np1 = p1.slice(1), np2 = p2.slice(1);

    if (rankVal(c1) > rankVal(c2)) {
      setP1([...np1, c1, c2]); setP2(np2); setMessage('You win this round! 💪');
    } else if (rankVal(c2) > rankVal(c1)) {
      setP1(np1); setP2([...np2, c1, c2]); setMessage('Opponent wins! 😤');
    } else {
      // War!
      const warCards1 = np1.slice(0, 3), warCards2 = np2.slice(0, 3);
      setP1([...np1.slice(3), ...warCards2, c1, c2]); setP2([...np2.slice(3), ...warCards1]);
      setMessage('⚔️ WAR! Cards shuffled!');
    }

    if (np1.length <= 1) { setMessage('Opponent Wins the War! 💀'); setGameOver(true); }
    if (np2.length <= 1) { setMessage('You Win the War! 🏆'); setGameOver(true); }
  };

  return (
    <GameLayout title="War" onRestart={init} accentColor="orange"
      rules="Both players flip their top card.\nHigher card wins both cards.\nIf tied, it's WAR — 3 cards go to the pot!\nCollect all 52 cards to win!"
      score={<div className="flex gap-4 text-sm"><span className="text-primary">You: {p1.length}</span><span className="text-secondary">AI: {p2.length}</span></div>}>
      <div className="text-lg font-display font-bold text-accent mb-4 animate-fade-in">{message}</div>
      <div className="flex gap-8 mb-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">You</span>
          {p1Card ? <div className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${isRed(p1Card) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}`}>{p1Card}</div>
            : <div className="w-16 h-24 rounded-lg border border-border bg-muted/20" />}
        </div>
        <div className="flex items-center text-2xl">⚡</div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">AI</span>
          {p2Card ? <div className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${isRed(p2Card) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}`}>{p2Card}</div>
            : <div className="w-16 h-24 rounded-lg border border-border bg-muted/20" />}
        </div>
      </div>
      <button onClick={battle} disabled={gameOver}
        className="px-8 py-3 rounded-xl bg-neon-orange/20 border-2 border-neon-orange text-neon-orange font-display font-bold text-lg hover:bg-neon-orange/30 disabled:opacity-50 transition-all">
        ⚔️ Battle!
      </button>
    </GameLayout>
  );
};

export default WarPage;
