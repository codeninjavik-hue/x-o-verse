import { Player } from '@/hooks/useGameLogic';
import { cn } from '@/lib/utils';

interface GameCellProps {
  value: Player;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
  index: number;
}

const GameCell = ({ value, onClick, isWinning, disabled, index }: GameCellProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={cn(
        'game-cell aspect-square text-4xl sm:text-5xl md:text-6xl font-display font-bold',
        'cursor-pointer disabled:cursor-not-allowed',
        value !== null && 'occupied',
        isWinning && 'winner',
        value === 'X' && 'player-x',
        value === 'O' && 'player-o'
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {value && (
        <span className="animate-scale-in inline-block">
          {value}
        </span>
      )}
    </button>
  );
};

export default GameCell;
