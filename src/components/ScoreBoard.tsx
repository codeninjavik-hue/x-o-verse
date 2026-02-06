import { cn } from '@/lib/utils';
import { Trophy, Skull } from 'lucide-react';

// Match color themes that rotate each game
const matchThemes = [
  { x: 'text-primary', o: 'text-secondary', xBorder: 'border-primary neon-border', oBorder: 'border-secondary neon-border-magenta' },
  { x: 'text-neon-green', o: 'text-neon-orange', xBorder: 'border-neon-green shadow-[0_0_20px_hsl(150_100%_50%/0.4)]', oBorder: 'border-neon-orange shadow-[0_0_20px_hsl(30_100%_55%/0.4)]' },
  { x: 'text-accent', o: 'text-primary', xBorder: 'border-accent shadow-[0_0_20px_hsl(280_100%_65%/0.4)]', oBorder: 'border-primary neon-border' },
  { x: 'text-neon-orange', o: 'text-neon-green', xBorder: 'border-neon-orange shadow-[0_0_20px_hsl(30_100%_55%/0.4)]', oBorder: 'border-neon-green shadow-[0_0_20px_hsl(150_100%_50%/0.4)]' },
  { x: 'text-secondary', o: 'text-accent', xBorder: 'border-secondary neon-border-magenta', oBorder: 'border-accent shadow-[0_0_20px_hsl(280_100%_65%/0.4)]' },
];

interface ScoreBoardProps {
  scores: { X: number; O: number };
  playerXName?: string;
  playerOName?: string;
  currentPlayer: 'X' | 'O' | null;
  winner?: 'X' | 'O' | null;
  gameStatus?: 'playing' | 'won' | 'draw';
  matchCount?: number;
}

const ScoreBoard = ({ 
  scores, 
  playerXName = 'Player X', 
  playerOName = 'Player O',
  currentPlayer,
  winner,
  gameStatus = 'playing',
  matchCount = 0,
}: ScoreBoardProps) => {
  const theme = matchThemes[matchCount % matchThemes.length];
  const isFinished = gameStatus === 'won' || gameStatus === 'draw';

  return (
    <div className="flex justify-center gap-6 sm:gap-10">
      {/* Player X Side */}
      <div 
        className={cn(
          "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 relative",
          currentPlayer === 'X' && !isFinished
            ? theme.xBorder
            : "border-border/50",
          winner === 'X' && 'border-neon-green shadow-[0_0_30px_hsl(150_100%_50%/0.5)]',
          winner === 'O' && gameStatus === 'won' && 'opacity-60'
        )}
      >
        {/* Winner / Loser Badge */}
        {gameStatus === 'won' && (
          <div className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border animate-scale-in",
            winner === 'X' 
              ? 'bg-neon-green/20 text-neon-green border-neon-green/50' 
              : 'bg-destructive/20 text-destructive border-destructive/50'
          )}>
            {winner === 'X' ? <><Trophy className="w-3 h-3" /> Winner</> : <><Skull className="w-3 h-3" /> Loser</>}
          </div>
        )}

        <span className="text-sm text-muted-foreground font-medium mb-1">
          {playerXName}
        </span>
        <span className={cn("text-3xl sm:text-4xl font-display font-bold", theme.x)}>
          X
        </span>
        <span className="text-2xl font-display font-semibold text-foreground mt-1">
          {scores.X}
        </span>
      </div>

      <div className="flex items-center">
        <span className="text-2xl font-display text-muted-foreground">VS</span>
      </div>

      {/* Player O Side */}
      <div 
        className={cn(
          "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 relative",
          currentPlayer === 'O' && !isFinished
            ? theme.oBorder
            : "border-border/50",
          winner === 'O' && 'border-neon-green shadow-[0_0_30px_hsl(150_100%_50%/0.5)]',
          winner === 'X' && gameStatus === 'won' && 'opacity-60'
        )}
      >
        {/* Winner / Loser Badge */}
        {gameStatus === 'won' && (
          <div className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border animate-scale-in",
            winner === 'O' 
              ? 'bg-neon-green/20 text-neon-green border-neon-green/50' 
              : 'bg-destructive/20 text-destructive border-destructive/50'
          )}>
            {winner === 'O' ? <><Trophy className="w-3 h-3" /> Winner</> : <><Skull className="w-3 h-3" /> Loser</>}
          </div>
        )}

        <span className="text-sm text-muted-foreground font-medium mb-1">
          {playerOName}
        </span>
        <span className={cn("text-3xl sm:text-4xl font-display font-bold", theme.o)}>
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
