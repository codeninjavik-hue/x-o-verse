import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const SUITS = ['♠','♥','♦','♣'];

const createDeck = () => {
  const d: string[] = [];
  SUITS.forEach(s => RANKS.forEach(r => d.push(`${r}${s}`)));
  for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
  return d;
};
const getRank = (c: string) => c.slice(0, -1);

const GoFishPage = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [player, setPlayer] = useState<string[]>([]);
  const [ai, setAi] = useState<string[]>([]);
  const [scores, setScores] = useState([0, 0]);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const checkBooks = (hand: string[], who: number) => {
    const counts: Record<string, string[]> = {};
    hand.forEach(c => { const r = getRank(c); if (!counts[r]) counts[r] = []; counts[r].push(c); });
    let books = 0;
    const remaining = hand.filter(c => { if (counts[getRank(c)]?.length === 4) { return false; } return true; });
    Object.values(counts).forEach(g => { if (g.length === 4) books++; });
    if (books > 0) setScores(s => { const ns = [...s]; ns[who] += books; return ns; });
    return remaining;
  };

  const init = useCallback(() => {
    const d = createDeck();
    setPlayer(d.slice(0, 7)); setAi(d.slice(7, 14)); setDeck(d.slice(14));
    setScores([0, 0]); setMessage(''); setGameOver(false);
  }, []);

  useState(() => { init(); });

  const askForCard = (rank: string) => {
    if (gameOver) return;
    const found = ai.filter(c => getRank(c) === rank);
    if (found.length > 0) {
      const newAi = ai.filter(c => getRank(c) !== rank);
      let newPlayer = [...player, ...found];
      newPlayer = checkBooks(newPlayer, 0);
      setPlayer(newPlayer); setAi(newAi);
      setMessage(`Got ${found.length} ${rank}(s) from AI!`);
    } else {
      if (deck.length > 0) {
        const nd = [...deck]; const card = nd.shift()!;
        let np = [...player, card];
        np = checkBooks(np, 0);
        setPlayer(np); setDeck(nd);
        setMessage('Go Fish! 🐟');
      } else setMessage('Deck empty!');
    }

    setTimeout(() => {
      if (ai.length > 0) {
        const aiRank = getRank(ai[Math.floor(Math.random() * ai.length)]);
        const found2 = player.filter(c => getRank(c) === aiRank);
        if (found2.length > 0) {
          const np2 = player.filter(c => getRank(c) !== aiRank);
          let na2 = [...ai, ...found2];
          na2 = checkBooks(na2, 1);
          setPlayer(np2); setAi(na2);
          setMessage(m => m + ` | AI took your ${aiRank}(s)!`);
        } else if (deck.length > 0) {
          const nd = [...deck]; const c2 = nd.shift()!;
          let na = [...ai, c2]; na = checkBooks(na, 1);
          setAi(na); setDeck(nd);
        }
      }
      if (player.length === 0 && ai.length === 0) setGameOver(true);
    }, 600);
  };

  const uniqueRanks = [...new Set(player.map(getRank))];

  return (
    <GameLayout title="Go Fish" onRestart={init} accentColor="green"
      rules="Ask the AI for a rank you have.\nIf they have it, you get their cards.\nIf not, 'Go Fish!' — draw from the deck.\nCollect 4 of a kind (a book) to score.\nMost books wins!"
      score={<div className="flex gap-4 text-sm"><span className="text-neon-green">You: {scores[0]} books</span><span className="text-secondary">AI: {scores[1]} books</span></div>}>
      {gameOver && <div className="text-xl font-display font-bold text-neon-green mb-3 animate-scale-in">{scores[0] > scores[1] ? 'You Win! 🏆' : 'AI Wins! 💀'}</div>}
      {message && <div className="text-sm text-muted-foreground mb-2 animate-fade-in">{message}</div>}
      <div className="text-xs text-muted-foreground mb-2">Deck: {deck.length} | AI: {ai.length} cards</div>
      <div className="text-xs text-muted-foreground mb-1">Ask for a rank:</div>
      <div className="flex gap-1 flex-wrap justify-center mb-4">
        {uniqueRanks.map(r => (
          <button key={r} onClick={() => askForCard(r)}
            className="px-3 py-1 rounded border border-neon-green/50 text-neon-green text-sm hover:bg-neon-green/20 transition-all">{r}</button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mb-1">Your Hand:</div>
      <div className="flex gap-1 flex-wrap justify-center">
        {player.map((c, i) => (
          <div key={i} className="w-10 h-14 rounded border border-border bg-muted/40 flex items-center justify-center text-[10px] font-bold">{c}</div>
        ))}
      </div>
    </GameLayout>
  );
};

export default GoFishPage;
