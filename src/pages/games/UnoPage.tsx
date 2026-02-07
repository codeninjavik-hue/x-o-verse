import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const UNO_COLORS = ['red', 'blue', 'green', 'yellow'];
const UNO_VALUES = ['0','1','2','3','4','5','6','7','8','9','Skip','Reverse','+2'];
const colorClass: Record<string, string> = { red: 'bg-red-500/30 border-red-500 text-red-400', blue: 'bg-blue-500/30 border-blue-500 text-blue-400', green: 'bg-green-500/30 border-green-500 text-green-400', yellow: 'bg-yellow-400/30 border-yellow-400 text-yellow-300', wild: 'bg-purple-500/30 border-purple-500 text-purple-400' };

interface UnoCard { color: string; value: string; }

const createDeck = (): UnoCard[] => {
  const d: UnoCard[] = [];
  UNO_COLORS.forEach(c => UNO_VALUES.forEach(v => { d.push({ color: c, value: v }); if (v !== '0') d.push({ color: c, value: v }); }));
  for (let i = 0; i < 4; i++) { d.push({ color: 'wild', value: 'Wild' }); d.push({ color: 'wild', value: 'Wild+4' }); }
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};

const UnoPage = () => {
  const [deck, setDeck] = useState<UnoCard[]>([]);
  const [playerHand, setPlayerHand] = useState<UnoCard[]>([]);
  const [aiHand, setAiHand] = useState<UnoCard[]>([]);
  const [pile, setPile] = useState<UnoCard[]>([]);
  const [currentColor, setCurrentColor] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const init = useCallback(() => {
    const d = createDeck();
    setPlayerHand(d.slice(0, 7)); setAiHand(d.slice(7, 14));
    setPile([d[14]]); setCurrentColor(d[14].color === 'wild' ? 'red' : d[14].color);
    setDeck(d.slice(15)); setMessage(''); setGameOver(false);
  }, []);

  useState(() => { init(); });

  const canPlay = (card: UnoCard) => card.color === 'wild' || card.color === currentColor || card.value === pile[pile.length - 1]?.value;

  const playCard = (idx: number) => {
    if (gameOver) return;
    const card = playerHand[idx];
    if (!canPlay(card)) { setMessage('Cannot play this card!'); return; }

    const nh = playerHand.filter((_, i) => i !== idx);
    setPile([...pile, card]); setPlayerHand(nh); setMessage('');

    if (card.color === 'wild') {
      setCurrentColor(UNO_COLORS[Math.floor(Math.random() * 4)]);
    } else setCurrentColor(card.color);

    if (card.value === '+2') {
      const nd = [...deck]; const drawn = nd.splice(0, 2);
      setAiHand([...aiHand, ...drawn]); setDeck(nd);
    }
    if (card.value === 'Wild+4') {
      const nd = [...deck]; const drawn = nd.splice(0, 4);
      setAiHand([...aiHand, ...drawn]); setDeck(nd);
    }

    if (nh.length === 0) { setMessage('🏆 You Win!'); setGameOver(true); return; }

    setTimeout(() => aiTurn([...pile, card], card.color === 'wild' ? UNO_COLORS[Math.floor(Math.random() * 4)] : card.color), 800);
  };

  const drawCard = () => {
    if (deck.length === 0) return;
    const nd = [...deck]; const card = nd.shift()!;
    setPlayerHand([...playerHand, card]); setDeck(nd);
    setTimeout(() => aiTurn(pile, currentColor), 500);
  };

  const aiTurn = (currentPile: UnoCard[], color: string) => {
    const topCard = currentPile[currentPile.length - 1];
    const playable = aiHand.findIndex(c => c.color === 'wild' || c.color === color || c.value === topCard?.value);
    if (playable >= 0) {
      const card = aiHand[playable];
      const nh = aiHand.filter((_, i) => i !== playable);
      setPile([...currentPile, card]); setAiHand(nh);
      if (card.color === 'wild') setCurrentColor(UNO_COLORS[Math.floor(Math.random() * 4)]);
      else setCurrentColor(card.color);
      if (card.value === '+2') { const nd = [...deck]; const drawn = nd.splice(0, 2); setPlayerHand(prev => [...prev, ...drawn]); setDeck(nd); }
      if (nh.length === 0) { setMessage('AI Wins! 💀'); setGameOver(true); }
    } else if (deck.length > 0) {
      const nd = [...deck]; const card = nd.shift()!;
      setAiHand([...aiHand, card]); setDeck(nd);
    }
  };

  const topCard = pile[pile.length - 1];

  return (
    <GameLayout title="UNO" onRestart={init} accentColor="purple"
      rules="Match the top card by color or number.\nWild cards can be played anytime.\n+2 makes opponent draw 2, Wild+4 draws 4.\nFirst to empty their hand wins!"
      score={<div className="text-sm">Deck: {deck.length} | AI Cards: {aiHand.length}</div>}>
      {message && <div className={`text-lg font-display font-bold mb-3 animate-scale-in ${gameOver ? 'text-accent' : 'text-muted-foreground'}`}>{message}</div>}

      <div className="text-xs text-muted-foreground mb-2">AI: {aiHand.length} cards</div>
      <div className="flex gap-1 mb-3">{aiHand.map((_, i) => <div key={i} className="w-8 h-12 rounded bg-primary/10 border border-primary/20" />)}</div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-xs text-muted-foreground">Current Color:</span>
        <div className={`w-6 h-6 rounded-full ${currentColor === 'red' ? 'bg-red-500' : currentColor === 'blue' ? 'bg-blue-500' : currentColor === 'green' ? 'bg-green-500' : 'bg-yellow-400'}`} />
        {topCard && (
          <div className={`w-14 h-20 rounded-lg border-2 flex items-center justify-center text-xs font-bold ${colorClass[topCard.color]}`}>
            {topCard.value}
          </div>
        )}
        <button onClick={drawCard} disabled={gameOver} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm hover:bg-muted disabled:opacity-50">Draw</button>
      </div>

      <div className="text-xs text-muted-foreground mb-1">Your Hand:</div>
      <div className="flex gap-1 flex-wrap justify-center max-w-lg">
        {playerHand.map((card, i) => (
          <button key={i} onClick={() => playCard(i)} disabled={!canPlay(card) || gameOver}
            className={`w-12 h-16 sm:w-14 sm:h-20 rounded-lg border-2 flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all
              ${colorClass[card.color]} ${canPlay(card) ? 'hover:scale-110 hover:-translate-y-1' : 'opacity-50'}`}>
            {card.value}
          </button>
        ))}
      </div>
    </GameLayout>
  );
};

export default UnoPage;
