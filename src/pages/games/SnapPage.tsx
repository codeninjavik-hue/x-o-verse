import { useState, useCallback, useEffect, useRef } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♠','♥','♦','♣'], RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const isRed = (c: string) => c.endsWith('♥') || c.endsWith('♦');
const getRank = (c: string) => c.slice(0, -1);

const createDeck = () => {
  const d: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => d.push(`${r}${s}`)));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

const SnapPage = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [pile, setPile] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [message, setMessage] = useState('');
  const [flipping, setFlipping] = useState(false);
  const timerRef = useRef<number>(0);

  const init = useCallback(() => {
    setDeck(createDeck()); setPile([]); setScore(0); setAiScore(0); setMessage('Press Flip to start!'); setFlipping(false);
  }, []);

  useState(() => { init(); });

  const flip = () => {
    if (deck.length === 0) { setMessage('Game Over!'); return; }
    const card = deck[0];
    const nd = deck.slice(1);
    setDeck(nd); setPile(p => [...p, card]); setFlipping(true);
    setTimeout(() => setFlipping(false), 300);

    // Check for snap (matching rank with previous)
    if (pile.length > 0 && getRank(card) === getRank(pile[pile.length - 1])) {
      // AI might snap first (random chance)
      timerRef.current = window.setTimeout(() => {
        if (pile.length > 0) { setAiScore(s => s + pile.length + 1); setPile([]); setMessage('AI snapped first! 😤'); }
      }, 300 + Math.random() * 700);
    }
  };

  const snap = () => {
    clearTimeout(timerRef.current);
    if (pile.length >= 2 && getRank(pile[pile.length - 1]) === getRank(pile[pile.length - 2])) {
      setScore(s => s + pile.length); setPile([]); setMessage('SNAP! 🎉 You got the pile!');
    } else {
      setMessage('Wrong snap! -2 penalty'); setScore(s => Math.max(0, s - 2));
    }
  };

  const gameOver = deck.length === 0;

  return (
    <GameLayout title="Snap" onRestart={init} accentColor="purple"
      rules="Flip cards one at a time.\nWhen two consecutive cards match rank, shout SNAP!\nBe faster than the AI to claim the pile.\nWrong snaps cost 2 points."
      score={<div className="flex gap-4 text-sm"><span className="text-accent">You: {score}</span><span className="text-secondary">AI: {aiScore}</span></div>}>
      {gameOver && <div className="text-xl font-display font-bold text-accent mb-3 animate-scale-in">{score > aiScore ? 'You Win! 🏆' : 'AI Wins! 💀'}</div>}
      <div className="text-sm text-muted-foreground mb-3">{message}</div>
      <div className="flex gap-6 items-center mb-6">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Deck ({deck.length})</div>
          <div className="w-16 h-24 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">🂠</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Pile ({pile.length})</div>
          {pile.length > 0 ? (
            <div className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all
              ${flipping ? 'scale-110' : ''} ${isRed(pile[pile.length - 1]) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}`}>
              {pile[pile.length - 1]}
            </div>
          ) : <div className="w-16 h-24 rounded-lg border border-border/30" />}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={flip} disabled={gameOver} className="px-6 py-3 rounded-xl bg-primary/20 border border-primary text-primary font-display hover:bg-primary/30 disabled:opacity-50">Flip 🃏</button>
        <button onClick={snap} disabled={gameOver || pile.length < 2} className="px-6 py-3 rounded-xl bg-accent/20 border border-accent text-accent font-display font-bold hover:bg-accent/30 disabled:opacity-50 text-lg">SNAP! ⚡</button>
      </div>
    </GameLayout>
  );
};

export default SnapPage;
