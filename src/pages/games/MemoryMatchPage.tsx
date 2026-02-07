import { useState, useCallback, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';

const EMOJIS = ['🎮', '🎲', '🎯', '🏆', '⚡', '🔥', '💎', '🌟'];

const MemoryMatchPage = () => {
  const [cards, setCards] = useState<{ emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initCards = useCallback(() => {
    const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map(emoji => ({ emoji, flipped: false, matched: false }));
    setCards(deck); setFlipped([]); setMoves(0); setMatches(0);
  }, []);

  useEffect(() => { initCards(); }, [initCards]);

  const handleFlip = (idx: number) => {
    if (flipped.length >= 2 || cards[idx].flipped || cards[idx].matched) return;
    const nc = [...cards]; nc[idx].flipped = true; setCards(nc);
    const nf = [...flipped, idx];
    setFlipped(nf);

    if (nf.length === 2) {
      setMoves(m => m + 1);
      if (nc[nf[0]].emoji === nc[nf[1]].emoji) {
        setTimeout(() => {
          const mc = [...nc]; mc[nf[0]].matched = true; mc[nf[1]].matched = true;
          setCards(mc); setFlipped([]); setMatches(m => m + 1);
        }, 500);
      } else {
        setTimeout(() => {
          const mc = [...nc]; mc[nf[0]].flipped = false; mc[nf[1]].flipped = false;
          setCards(mc); setFlipped([]);
        }, 800);
      }
    }
  };

  return (
    <GameLayout title="Memory Match" onRestart={initCards} accentColor="cyan"
      rules="Flip two cards to find matching pairs.\nRemember card positions to match all pairs.\nTry to complete with the fewest moves!"
      score={<div className="text-sm">Moves: {moves} | Matches: {matches}/{EMOJIS.length}</div>}>
      {matches === EMOJIS.length && <div className="text-2xl font-display font-bold text-primary mb-4 animate-scale-in">🎉 You Won in {moves} moves!</div>}
      <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
        {cards.map((card, i) => (
          <button key={i} onClick={() => handleFlip(i)}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 transition-all duration-300
              ${card.matched ? 'bg-primary/20 border-primary scale-95' : card.flipped ? 'bg-muted border-accent' : 'bg-muted/50 border-border hover:border-primary/50 hover:scale-105'}`}>
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </GameLayout>
  );
};

export default MemoryMatchPage;
