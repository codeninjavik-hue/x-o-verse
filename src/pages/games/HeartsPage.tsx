import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♣','♦','♠','♥'], RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const isRed = (c: string) => c.endsWith('♥') || c.endsWith('♦');
const getSuit = (c: string) => c.slice(-1);
const getRankVal = (c: string) => RANKS.indexOf(c.slice(0, -1));

const createDeck = () => {
  const d: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => d.push(`${r}${s}`)));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

const HeartsPage = () => {
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [trick, setTrick] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(0);

  const deal = useCallback(() => {
    const d = createDeck();
    setPlayerHand(d.slice(0, 13).sort((a, b) => SUITS.indexOf(getSuit(a)) - SUITS.indexOf(getSuit(b)) || getRankVal(a) - getRankVal(b)));
    setTrick([]); setMessage(''); setRound(r => r + 1);
  }, []);

  useState(() => { deal(); });

  const playCard = (idx: number) => {
    const card = playerHand[idx];
    if (trick.length > 0 && getSuit(card) !== getSuit(trick[0]) && playerHand.some(c => getSuit(c) === getSuit(trick[0]))) return;

    const nh = playerHand.filter((_, i) => i !== idx);
    const nt = [...trick, card];
    setPlayerHand(nh); setTrick(nt);

    if (nt.length < 4) {
      // AI plays
      setTimeout(() => {
        const aiCards = ['AI1', 'AI2', 'AI3'].map(() => {
          const suit = nt.length > 0 ? getSuit(nt[0]) : SUITS[Math.floor(Math.random() * 4)];
          const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
          return `${rank}${suit}`;
        });
        const fullTrick = [...nt, ...aiCards.slice(0, 4 - nt.length)];
        const hearts = fullTrick.filter(c => getSuit(c) === '♥').length;
        const hasQueen = fullTrick.some(c => c === 'Q♠');
        const points = hearts + (hasQueen ? 13 : 0);
        const ns = [...scores]; ns[0] += points;
        setScores(ns); setTrick([]);
        setMessage(points > 0 ? `You took ${points} points!` : 'Safe trick!');
      }, 500);
    }
  };

  return (
    <GameLayout title="Hearts" onRestart={deal} accentColor="magenta"
      rules="Avoid taking Hearts (1 point each) and Queen of Spades (13 points).\nFollow suit if possible.\nLowest score wins!"
      score={<div className="text-sm">Score: {scores[0]} pts | Round {round}</div>}>
      {message && <div className="text-sm text-accent mb-2 animate-fade-in">{message}</div>}

      {trick.length > 0 && (
        <div className="flex gap-2 mb-4">
          {trick.map((c, i) => (
            <div key={i} className={`w-12 h-16 rounded border-2 flex items-center justify-center text-xs font-bold ${isRed(c) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}`}>{c}</div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground mb-2">Your Hand ({playerHand.length} cards):</div>
      <div className="flex gap-1 flex-wrap justify-center max-w-lg">
        {playerHand.map((c, i) => (
          <button key={i} onClick={() => playCard(i)}
            className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 hover:-translate-y-1
              ${isRed(c) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}`}>{c}</button>
        ))}
      </div>
      {playerHand.length === 0 && <button onClick={deal} className="mt-4 px-4 py-2 rounded-lg bg-secondary/20 border border-secondary text-secondary font-display">New Round</button>}
    </GameLayout>
  );
};

export default HeartsPage;
