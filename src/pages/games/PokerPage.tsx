import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const isRed = (s: string) => s === '♥' || s === '♦';

const createDeck = () => {
  const d: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => d.push(`${r}${s}`)));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

const rankVal = (c: string) => RANKS.indexOf(c.slice(0, -1));

const evaluateHand = (cards: string[]): { score: number; name: string } => {
  const ranks = cards.map(c => rankVal(c)).sort((a, b) => b - a);
  const suits = cards.map(c => c.slice(-1));
  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = ranks.every((r, i) => i === 0 || ranks[i - 1] - r === 1);
  const counts: Record<number, number> = {};
  ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
  const groups = Object.values(counts).sort((a, b) => b - a);

  if (isFlush && isStraight && ranks[0] === 12) return { score: 9, name: 'Royal Flush' };
  if (isFlush && isStraight) return { score: 8, name: 'Straight Flush' };
  if (groups[0] === 4) return { score: 7, name: 'Four of a Kind' };
  if (groups[0] === 3 && groups[1] === 2) return { score: 6, name: 'Full House' };
  if (isFlush) return { score: 5, name: 'Flush' };
  if (isStraight) return { score: 4, name: 'Straight' };
  if (groups[0] === 3) return { score: 3, name: 'Three of a Kind' };
  if (groups[0] === 2 && groups[1] === 2) return { score: 2, name: 'Two Pair' };
  if (groups[0] === 2) return { score: 1, name: 'Pair' };
  return { score: 0, name: 'High Card' };
};

const PokerPage = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [phase, setPhase] = useState<'bet' | 'deal' | 'draw' | 'result'>('bet');
  const [chips, setChips] = useState(100);
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState('');

  const deal = useCallback(() => {
    const d = createDeck();
    setHand(d.slice(0, 5)); setDeck(d.slice(5)); setHeld([false, false, false, false, false]);
    setPhase('draw'); setResult(''); setChips(c => c - bet);
  }, [bet]);

  const draw = () => {
    const nh = [...hand]; let di = 0;
    held.forEach((h, i) => { if (!h) { nh[i] = deck[di++]; } });
    setHand(nh);
    const eval_ = evaluateHand(nh);
    const payouts: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 6, 6: 9, 7: 25, 8: 50, 9: 250 };
    const win = payouts[eval_.score] * bet;
    setChips(c => c + win);
    setResult(win > 0 ? `${eval_.name}! Won $${win} 🏆` : `${eval_.name} - No Win`);
    setPhase('result');
  };

  const toggleHold = (i: number) => { const nh = [...held]; nh[i] = !nh[i]; setHeld(nh); };

  const renderCard = (card: string, isHeld: boolean) => {
    const suit = card.slice(-1);
    return (
      <div className={`relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all
        ${isRed(suit) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 text-foreground border-border'}
        ${isHeld ? 'ring-2 ring-accent -translate-y-2' : ''}`}>
        {card}
        {isHeld && <span className="absolute -bottom-5 text-[10px] text-accent">HELD</span>}
      </div>
    );
  };

  return (
    <GameLayout title="Video Poker" onRestart={() => { setPhase('bet'); setResult(''); }} accentColor="orange"
      rules="Place a bet and receive 5 cards.\nChoose cards to hold, then draw replacements.\nBest poker hand wins!\n\nPayouts: Pair 1x, Two Pair 2x, Three 3x, Straight 4x, Flush 6x, Full House 9x, Four 25x, Straight Flush 50x, Royal Flush 250x"
      score={<div className="text-sm">Chips: 💰 {chips}</div>}>

      {phase === 'bet' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[5, 10, 25].map(b => (
              <button key={b} onClick={() => setBet(b)} disabled={b > chips}
                className={`px-4 py-2 rounded-lg border font-bold ${bet === b ? 'bg-neon-orange/30 border-neon-orange text-neon-orange' : 'border-border'} disabled:opacity-30`}>
                ${b}
              </button>
            ))}
          </div>
          <button onClick={deal} disabled={chips < bet}
            className="px-6 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange font-display hover:bg-neon-orange/30">Deal 🃏</button>
        </div>
      )}

      {(phase === 'draw' || phase === 'result') && (
        <div className="flex flex-col items-center gap-6">
          {result && <div className="text-xl font-display font-bold text-accent animate-scale-in">{result}</div>}
          <div className="flex gap-2 mb-2">
            {hand.map((c, i) => (
              <button key={i} onClick={() => phase === 'draw' && toggleHold(i)}>{renderCard(c, held[i])}</button>
            ))}
          </div>
          {phase === 'draw' && (
            <button onClick={draw} className="px-6 py-2 rounded-lg bg-accent/20 border border-accent text-accent font-display hover:bg-accent/30">
              Draw 🎴
            </button>
          )}
          {phase === 'result' && (
            <button onClick={() => setPhase('bet')} className="px-5 py-2 rounded-lg bg-primary/20 border border-primary text-primary font-display hover:bg-primary/30">
              New Hand
            </button>
          )}
        </div>
      )}
    </GameLayout>
  );
};

export default PokerPage;
