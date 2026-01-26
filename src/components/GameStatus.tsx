import { GameStatus as Status, Player } from '@/hooks/useGameLogic';
import { cn } from '@/lib/utils';

interface GameStatusProps {
  status: Status;
  winner: Player;
  currentPlayer: Player;
  isAIThinking?: boolean;
}

const GameStatusDisplay = ({ status, winner, currentPlayer, isAIThinking }: GameStatusProps) => {
  if (isAIThinking) {
    return (
      <div className="text-center animate-thinking">
        <p className="text-xl sm:text-2xl font-display text-muted-foreground">
          🤖 Robot is thinking...
        </p>
      </div>
    );
  }

  if (status === 'won') {
    return (
      <div className="text-center animate-scale-in">
        <p className="text-2xl sm:text-3xl font-display font-bold">
          <span className={cn(winner === 'X' ? 'player-x' : 'player-o')}>
            {winner}
          </span>
          <span className="text-foreground"> Wins!</span>
        </p>
        <p className="text-lg text-neon-green mt-2">🎉 Congratulations!</p>
      </div>
    );
  }

  if (status === 'draw') {
    return (
      <div className="text-center animate-scale-in">
        <p className="text-2xl sm:text-3xl font-display font-bold text-neon-orange">
          It's a Draw!
        </p>
        <p className="text-lg text-muted-foreground mt-2">🤝 Well played!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-xl sm:text-2xl font-display">
        <span className={cn(currentPlayer === 'X' ? 'player-x' : 'player-o')}>
          {currentPlayer}
        </span>
        <span className="text-muted-foreground">'s Turn</span>
      </p>
    </div>
  );
};

export default GameStatusDisplay;
