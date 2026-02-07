import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♠','♥','♦','♣'], RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const isRed = (c: string) => c.endsWith('♥') || c.endsWith('♦');

const createDeck = () => {
  const d: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => d.push(`${r}${s}`)));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

const CrazyEightsPage = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [player, setPlayer] = useState<string[]>([]);
  const [ai, setAi] = useState<string[]>([]);
  const [pile, setPile] = useState<string[]>([]);
  const [chosenSuit, setChosenSuit] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const init = useCallback(() => {
    const d = createDeck();
    setPlayer(d.slice(0, 7)); setAi(d.slice(7, 14)); setPile([d[14]]);
    setDeck(d.slice(15)); setChosenSuit(d[14].slice(-1)); setMessage(''); setGameOver(false);
  }, []);

  useState(() => { init(); });

  const getSuit = (c: string) => c.slice(-1);
  const getRank = (c: string) => c.slice(0, -1);
  const topCard = pile[pile.length - 1];
  const topSuit = chosenSuit || getSuit(topCard || '');

  const canPlay = (card: string) => getRank(card) === '8' || getSuit(card) === topSuit || getRank(card) === getRank(topCard || '');

  const playCard = (idx: number) => {
    if (gameOver) return;
    const card = player[idx];
    if (!canPlay(card)) return;
    const nh = player.filter((_, i) => i !== idx);
    setPile([...pile, card]); setPlayer(nh);

    if (getRank(card) === '8') {
      setChosenSuit(SUITS[Math.floor(Math.random() * 4)]);
    } else { setChosenSuit(getSuit(card)); }

    if (nh.length === 0) { setMessage('🏆 You Win!'); setGameOver(true); return; }
    setTimeout(() => aiPlay([...pile, card], getRank(card) === '8' ? SUITS[Math.floor(Math.random() * 4)] : getSuit(card)), 600);
  };

  const drawCard = () => {
    if (deck.length === 0 || gameOver) return;
    setPlayer([...player, deck[0]]); setDeck(deck.slice(1));
    setTimeout(() => aiPlay(pile, topSuit), 400);
  };

  const aiPlay = (currentPile: string[], suit: string) => {
    const top = currentPile[currentPile.length - 1];
    const playable = ai.findIndex(c => getRank(c) === '8' || getSuit(c) === suit || getRank(c) === getRank(top));
    if (playable >= 0) {
      const card = ai[playable];
      const nh = ai.filter((_, i) => i !== playable);
      setPile([...currentPile, card]); setAi(nh);
      setChosenSuit(getRank(card) === '8' ? SUITS[Math.floor(Math.random() * 4)] : getSuit(card));
      if (nh.length === 0) { setMessage('AI Wins! 💀'); setGameOver(true); }
    } else if (deck.length > 0) {
      setAi([...ai, deck[0]]); setDeck(deck.slice(1));
    }
  };

  return (
    <GameLayout title="Crazy Eights" onRestart={init} accentColor="cyan"
      rules="Match the top card by suit or rank.\nEights are wild — play anytime to change the suit.\nDraw a card if you can't play.\nFirst to empty hand wins!">
      {message && <div className="text-xl font-display font-bold text-primary mb-3 animate-scale-in">{message}</div>}
      <div className="text-xs text-muted-foreground mb-2">AI: {ai.length} cards | Deck: {deck.length}</div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-xs">Active Suit: <span className="font-bold">{chosenSuit}</span></div>
        {topCard && <div className={`w-14 h-20 rounded-lg border-2 flex items-center justify-center font-bold ${isRed(topCard) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}`}>{topCard}</div>}
        <button onClick={drawCard} disabled={gameOver || deck.length === 0} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm hover:bg-muted disabled:opacity-50">Draw</button>
      </div>
      <div className="flex gap-1 flex-wrap justify-center max-w-lg">
        {player.map((c, i) => (
          <button key={i} onClick={() => playCard(i)} disabled={!canPlay(c) || gameOver}
            className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all
              ${isRed(c) ? 'bg-red-900/40 text-red-400 border-red-500/40' : 'bg-muted/60 border-border'}
              ${canPlay(c) ? 'hover:scale-110 hover:-translate-y-1' : 'opacity-40'}`}>{c}</button>
        ))}
      </div>
    </GameLayout>
  );
};

export default CrazyEightsPage;
