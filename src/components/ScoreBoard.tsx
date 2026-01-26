import { cn } from '@/lib/utils';

interface ScoreBoardProps {
  scores: { X: number; O: number };
  playerXName?: string;
  playerOName?: string;
  currentPlayer: 'X' | 'O' | null;
}

const ScoreBoard = ({ 
  scores, 
  playerXName = 'Player X', 
  playerOName = 'Player O',
  currentPlayer 
}: ScoreBoardProps) => {
  return (
    <div className="flex justify-center gap-6 sm:gap-10">
      <div 
        className={cn(
          "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300",
          currentPlayer === 'X' 
            ? "border-primary neon-border" 
            : "border-border/50"
        )}
      >
        <span className="text-sm text-muted-foreground font-medium mb-1">
          {playerXName}
        </span>
        <span className="text-3xl sm:text-4xl font-display font-bold player-x">
          X
        </span>
        <span className="text-2xl font-display font-semibold text-foreground mt-1">
          {scores.X}
        </span>
      </div>

      <div className="flex items-center">
        <span className="text-2xl font-display text-muted-foreground">VS</span>
      </div>

      <div 
        className={cn(
          "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300",
          currentPlayer === 'O' 
            ? "border-secondary neon-border-magenta" 
            : "border-border/50"
        )}
      >
        <span className="text-sm text-muted-foreground font-medium mb-1">
          {playerOName}
        </span>
        <span className="text-3xl sm:text-4xl font-display font-bold player-o">
          O
        </span>
        <span className="text-2xl font-display font-semibold text-foreground mt-1">
          {scores.O}
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;
