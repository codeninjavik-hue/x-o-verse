import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const isRed = (s: string) => s === '♥' || s === '♦';

const createDeck = () => {
  const deck: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => deck.push(`${r}${s}`)));
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
};

const cardValue = (card: string) => {
  const rank = card.slice(0, -1);
  if (['J','Q','K'].includes(rank)) return 10;
  if (rank === 'A') return 11;
  return parseInt(rank);
};

const handValue = (hand: string[]) => {
  let total = hand.reduce((s, c) => s + cardValue(c), 0);
  let aces = hand.filter(c => c.startsWith('A')).length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
};

const BlackjackPage = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [player, setPlayer] = useState<string[]>([]);
  const [dealer, setDealer] = useState<string[]>([]);
  const [phase, setPhase] = useState<'bet' | 'play' | 'dealer' | 'done'>('bet');
  const [result, setResult] = useState('');
  const [chips, setChips] = useState(100);
  const [bet, setBet] = useState(10);

  const deal = useCallback(() => {
    const d = createDeck();
    setDeck(d.slice(4)); setPlayer([d[0], d[2]]); setDealer([d[1], d[3]]);
    setPhase('play'); setResult(''); setChips(c => c - bet);
  }, [bet]);

  const hit = () => {
    const np = [...player, deck[0]]; setPlayer(np); setDeck(deck.slice(1));
    if (handValue(np) > 21) { setResult('Bust! You Lose 💀'); setPhase('done'); }
  };

  const stand = () => {
    let d = [...dealer]; let dk = [...deck];
    while (handValue(d) < 17) { d.push(dk[0]); dk = dk.slice(1); }
    setDealer(d); setDeck(dk);
    const pv = handValue(player), dv = handValue(d);
    if (dv > 21) { setResult('Dealer Busts! You Win! 🏆'); setChips(c => c + bet * 2); }
    else if (pv > dv) { setResult('You Win! 🏆'); setChips(c => c + bet * 2); }
    else if (dv > pv) { setResult('Dealer Wins 💀'); }
    else { setResult("Push! It's a tie"); setChips(c => c + bet); }
    setPhase('done');
  };

  const renderCard = (card: string, hidden = false) => {
    const suit = card.slice(-1);
    return (
      <div className={`w-14 h-20 sm:w-16 sm:h-24 rounded-lg border-2 flex items-center justify-center text-lg sm:text-xl font-bold
        ${hidden ? 'bg-primary/10 border-primary/30 text-primary/30' : isRed(suit) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 text-foreground border-border'}`}>
        {hidden ? '🂠' : card}
      </div>
    );
  };

  return (
    <GameLayout title="Blackjack" onRestart={() => { setPhase('bet'); setResult(''); }} accentColor="magenta"
      rules="Get as close to 21 as possible without going over.\nFace cards = 10, Aces = 1 or 11.\nHit to draw a card, Stand to end your turn.\nDealer must hit on 16 and stand on 17."
      score={<div className="text-sm">Chips: 💰 {chips}</div>}>

      {phase === 'bet' && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg font-display">Place Your Bet</div>
          <div className="flex gap-2">
            {[5, 10, 25].map(b => (
              <button key={b} onClick={() => setBet(b)} disabled={b > chips}
                className={`px-4 py-2 rounded-lg border font-bold ${bet === b ? 'bg-secondary/30 border-secondary text-secondary' : 'border-border text-muted-foreground'} disabled:opacity-30`}>
                ${b}
              </button>
            ))}
          </div>
          <button onClick={deal} disabled={chips < bet}
            className="px-6 py-2 rounded-lg bg-secondary/20 border border-secondary text-secondary font-display hover:bg-secondary/30 disabled:opacity-50">
            Deal 🃏
          </button>
        </div>
      )}

      {phase !== 'bet' && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Dealer {phase === 'done' ? `(${handValue(dealer)})` : ''}</div>
            <div className="flex gap-2">
              {dealer.map((c, i) => <div key={i}>{renderCard(c, i > 0 && phase === 'play')}</div>)}
            </div>
          </div>

          {result && <div className="text-xl font-display font-bold text-accent animate-scale-in">{result}</div>}

          <div>
            <div className="text-xs text-muted-foreground mb-1">You ({handValue(player)})</div>
            <div className="flex gap-2">
              {player.map((c, i) => <div key={i}>{renderCard(c)}</div>)}
            </div>
          </div>

          {phase === 'play' && (
            <div className="flex gap-3">
              <button onClick={hit} className="px-5 py-2 rounded-lg bg-primary/20 border border-primary text-primary font-display hover:bg-primary/30">Hit</button>
              <button onClick={stand} className="px-5 py-2 rounded-lg bg-secondary/20 border border-secondary text-secondary font-display hover:bg-secondary/30">Stand</button>
            </div>
          )}

          {phase === 'done' && (
            <button onClick={() => setPhase('bet')} className="px-5 py-2 rounded-lg bg-accent/20 border border-accent text-accent font-display hover:bg-accent/30">
              New Hand
            </button>
          )}
        </div>
      )}
    </GameLayout>
  );
};

export default BlackjackPage;
