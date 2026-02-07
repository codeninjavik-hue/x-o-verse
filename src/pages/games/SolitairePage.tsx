import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const isRed = (s: string) => s === '♥' || s === '♦';

interface Card { rank: string; suit: string; faceUp: boolean; }

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach(s => RANKS.forEach(r => deck.push({ rank: r, suit: s, faceUp: false })));
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
};

const rankValue = (r: string) => RANKS.indexOf(r);

const SolitairePage = () => {
  const [tableau, setTableau] = useState<Card[][]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [selected, setSelected] = useState<{ source: string; idx: number; cardIdx: number } | null>(null);

  const init = useCallback(() => {
    const deck = createDeck();
    const tab: Card[][] = [];
    let idx = 0;
    for (let i = 0; i < 7; i++) {
      tab[i] = [];
      for (let j = 0; j <= i; j++) {
        const card = { ...deck[idx++] };
        if (j === i) card.faceUp = true;
        tab[i].push(card);
      }
    }
    const remaining = deck.slice(idx).map(c => ({ ...c, faceUp: false }));
    setTableau(tab); setFoundations([[], [], [], []]); setStock(remaining); setWaste([]); setSelected(null);
  }, []);

  useState(() => { init(); });

  const drawCard = () => {
    if (stock.length === 0) {
      setStock(waste.map(c => ({ ...c, faceUp: false })).reverse()); setWaste([]);
    } else {
      const ns = [...stock]; const card = { ...ns.pop()!, faceUp: true };
      setStock(ns); setWaste([...waste, card]);
    }
  };

  const canPlaceOnTableau = (card: Card, target: Card[]) => {
    if (target.length === 0) return card.rank === 'K';
    const top = target[target.length - 1];
    return top.faceUp && isRed(card.suit) !== isRed(top.suit) && rankValue(card.rank) === rankValue(top.rank) - 1;
  };

  const canPlaceOnFoundation = (card: Card, foundation: Card[]) => {
    if (foundation.length === 0) return card.rank === 'A';
    const top = foundation[foundation.length - 1];
    return card.suit === top.suit && rankValue(card.rank) === rankValue(top.rank) + 1;
  };

  const handleTableauClick = (colIdx: number, cardIdx: number) => {
    const col = tableau[colIdx];
    if (!col[cardIdx]?.faceUp) return;

    if (selected) {
      const cards = selected.source === 'waste' ? [waste[waste.length - 1]] :
        selected.source === 'tableau' ? tableau[selected.idx].slice(selected.cardIdx) : [];

      if (cards.length > 0 && canPlaceOnTableau(cards[0], col)) {
        const nt = tableau.map(c => [...c]);
        nt[colIdx].push(...cards);
        if (selected.source === 'tableau') {
          nt[selected.idx] = nt[selected.idx].slice(0, selected.cardIdx);
          if (nt[selected.idx].length > 0) nt[selected.idx][nt[selected.idx].length - 1].faceUp = true;
        }
        setTableau(nt);
        if (selected.source === 'waste') setWaste(waste.slice(0, -1));
        setSelected(null); return;
      }
      setSelected(null);
    }
    setSelected({ source: 'tableau', idx: colIdx, cardIdx });
  };

  const handleFoundationClick = (fIdx: number) => {
    if (!selected) return;
    const card = selected.source === 'waste' ? waste[waste.length - 1] :
      selected.source === 'tableau' ? tableau[selected.idx][tableau[selected.idx].length - 1] : null;

    if (card && canPlaceOnFoundation(card, foundations[fIdx])) {
      const nf = foundations.map(f => [...f]); nf[fIdx].push(card);
      if (selected.source === 'waste') setWaste(waste.slice(0, -1));
      if (selected.source === 'tableau') {
        const nt = tableau.map(c => [...c]); nt[selected.idx].pop();
        if (nt[selected.idx].length > 0) nt[selected.idx][nt[selected.idx].length - 1].faceUp = true;
        setTableau(nt);
      }
      setFoundations(nf);
    }
    setSelected(null);
  };

  const handleWasteClick = () => {
    if (waste.length === 0) return;
    setSelected({ source: 'waste', idx: 0, cardIdx: 0 });
  };

  const won = foundations.every(f => f.length === 13);

  const renderCard = (card: Card, highlight = false) => (
    <div className={`w-10 h-14 sm:w-12 sm:h-16 rounded border text-xs sm:text-sm flex items-center justify-center font-bold
      ${card.faceUp ? (isRed(card.suit) ? 'bg-red-900/40 text-red-400 border-red-500/30' : 'bg-muted/60 text-foreground border-border') : 'bg-primary/10 border-primary/30 text-primary/30'}
      ${highlight ? 'ring-2 ring-accent' : ''}`}>
      {card.faceUp ? `${card.rank}${card.suit}` : '🂠'}
    </div>
  );

  return (
    <GameLayout title="Solitaire" onRestart={init} accentColor="green"
      rules="Move cards to build 4 foundation piles (A→K by suit).\nIn tableau, stack cards in descending order, alternating colors.\nClick stock to draw cards. Click to select, then click destination.">
      {won && <div className="text-2xl font-display font-bold text-neon-green mb-4 animate-scale-in">🎉 You Won!</div>}

      <div className="w-full max-w-lg">
        <div className="flex justify-between mb-4">
          <div className="flex gap-1">
            <button onClick={drawCard} className="w-10 h-14 sm:w-12 sm:h-16 rounded border border-primary/30 bg-primary/10 flex items-center justify-center text-primary text-xs">
              {stock.length > 0 ? `🂠${stock.length}` : '↻'}
            </button>
            <button onClick={handleWasteClick} className={`${waste.length > 0 ? '' : 'opacity-30'}`}>
              {waste.length > 0 ? renderCard(waste[waste.length - 1], selected?.source === 'waste') :
                <div className="w-10 h-14 sm:w-12 sm:h-16 rounded border border-border/30" />}
            </button>
          </div>
          <div className="flex gap-1">
            {foundations.map((f, i) => (
              <button key={i} onClick={() => handleFoundationClick(i)}
                className="w-10 h-14 sm:w-12 sm:h-16 rounded border border-border/30 flex items-center justify-center">
                {f.length > 0 ? renderCard(f[f.length - 1]) :
                  <span className="text-muted-foreground/30 text-lg">{SUITS[i]}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 justify-center">
          {tableau.map((col, ci) => (
            <div key={ci} className="flex flex-col">
              {col.length === 0 ? (
                <button onClick={() => selected && handleTableauClick(ci, 0)}
                  className="w-10 h-14 sm:w-12 sm:h-16 rounded border border-border/20" />
              ) : col.map((card, idx) => (
                <button key={idx} onClick={() => handleTableauClick(ci, idx)}
                  className={`${idx > 0 ? '-mt-8 sm:-mt-10' : ''}`}>
                  {renderCard(card, selected?.source === 'tableau' && selected.idx === ci && idx >= selected.cardIdx)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  );
};

export default SolitairePage;
