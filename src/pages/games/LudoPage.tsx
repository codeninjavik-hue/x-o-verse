import { useState, useCallback } from 'react';
import GameLayout from '@/components/GameLayout';

const COLORS = ['text-red-500', 'text-blue-500', 'text-neon-green', 'text-yellow-400'];
const BG_COLORS = ['bg-red-500/20', 'bg-blue-500/20', 'bg-green-500/20', 'bg-yellow-400/20'];
const NAMES = ['Red', 'Blue', 'Green', 'Yellow'];
const PATH_LENGTH = 52;

const LudoPage = () => {
  const [positions, setPositions] = useState<number[][]>([[-1, -1], [-1, -1], [-1, -1], [-1, -1]]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(0);
  const [rolled, setRolled] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [scores, setScores] = useState([0, 0, 0, 0]);

  const reset = useCallback(() => {
    setPositions([[-1, -1], [-1, -1], [-1, -1], [-1, -1]]);
    setCurrentPlayer(0); setDice(0); setRolled(false); setWinner(null); setScores([0, 0, 0, 0]);
  }, []);

  const rollDice = () => {
    if (rolled || winner !== null) return;
    const val = Math.floor(Math.random() * 6) + 1;
    setDice(val);
    setRolled(true);
    const playerPos = positions[currentPlayer];
    const canMove = playerPos.some(p => {
      if (p === -1 && val === 6) return true;
      if (p >= 0 && p + val <= PATH_LENGTH) return true;
      return false;
    });
    if (!canMove) {
      setTimeout(() => { setCurrentPlayer((currentPlayer + 1) % 4); setRolled(false); }, 800);
    }
  };

  const moveToken = (tokenIdx: number) => {
    if (!rolled || winner !== null) return;
    const pos = positions[currentPlayer][tokenIdx];
    if (pos === -1 && dice !== 6) return;
    const newPos = pos === -1 ? 0 : pos + dice;
    if (newPos > PATH_LENGTH) return;

    const newPositions = positions.map(p => [...p]);
    newPositions[currentPlayer][tokenIdx] = newPos;
    const newScores = [...scores];

    if (newPos === PATH_LENGTH) {
      newScores[currentPlayer] += 1;
      if (newScores[currentPlayer] >= 2) { setWinner(currentPlayer); }
    }

    setPositions(newPositions); setScores(newScores);
    if (dice === 6) { setRolled(false); } else {
      setRolled(false); setCurrentPlayer((currentPlayer + 1) % 4);
    }
  };

  return (
    <GameLayout title="Ludo" onRestart={reset} accentColor="green"
      rules="Roll the dice and move your tokens around the board.\nRoll a 6 to bring a token out of base.\nRoll a 6 to get an extra turn.\nFirst player to get both tokens to the finish wins!\n\n4 players take turns.">
      {winner !== null && <div className="text-2xl font-display font-bold text-neon-green mb-4 animate-scale-in">🏆 {NAMES[winner]} Wins!</div>}

      <div className="flex gap-4 mb-4 flex-wrap justify-center">
        {NAMES.map((name, i) => (
          <div key={i} className={`px-3 py-1 rounded-lg border ${i === currentPlayer ? 'border-primary bg-primary/10' : 'border-border'} ${COLORS[i]} font-display text-sm`}>
            {name}: {scores[i]}/2 home
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={rollDice} disabled={rolled || winner !== null}
            className="px-6 py-3 rounded-xl bg-primary/20 border-2 border-primary text-primary font-display font-bold text-xl hover:bg-primary/30 disabled:opacity-50 transition-all">
            🎲 {dice || '?'}
          </button>
          <span className={`text-sm ${COLORS[currentPlayer]}`}>{NAMES[currentPlayer]}'s turn</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {positions.map((tokens, playerIdx) => (
            <div key={playerIdx} className={`p-4 rounded-xl border border-border ${BG_COLORS[playerIdx]}`}>
              <div className={`text-xs font-display mb-2 ${COLORS[playerIdx]}`}>{NAMES[playerIdx]}</div>
              {tokens.map((pos, tokenIdx) => (
                <button key={tokenIdx} onClick={() => playerIdx === currentPlayer && moveToken(tokenIdx)}
                  disabled={playerIdx !== currentPlayer || !rolled}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold m-1
                    ${playerIdx === currentPlayer && rolled ? 'hover:scale-110 cursor-pointer' : 'cursor-default opacity-70'}
                    ${COLORS[playerIdx]} border-current transition-all`}>
                  {pos === -1 ? '🏠' : pos >= PATH_LENGTH ? '🏁' : pos}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center gap-1">
            {Array.from({ length: PATH_LENGTH + 1 }, (_, i) => {
              const playersHere = positions.flatMap((tokens, pIdx) => tokens.filter(p => p === i).map(() => pIdx));
              return (
                <div key={i} className={`h-4 flex-1 rounded-sm border border-border/30 flex items-center justify-center
                  ${i === 0 ? 'bg-neon-green/30' : i === PATH_LENGTH ? 'bg-accent/30' : 'bg-muted/20'}
                  ${playersHere.length > 0 ? BG_COLORS[playersHere[0]] : ''}`} title={`Square ${i}`}>
                  {i % 13 === 0 && <div className="w-1 h-1 rounded-full bg-primary/50" />}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Start</span><span>Finish</span>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default LudoPage;
