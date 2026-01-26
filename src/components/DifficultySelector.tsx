import { Difficulty } from '@/utils/aiLogic';
import { cn } from '@/lib/utils';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: { value: Difficulty; label: string; emoji: string; color: string }[] = [
  { value: 'easy', label: 'Easy', emoji: '🟢', color: 'text-green-400 border-green-400/50 hover:border-green-400' },
  { value: 'medium', label: 'Medium', emoji: '🟡', color: 'text-yellow-400 border-yellow-400/50 hover:border-yellow-400' },
  { value: 'hard', label: 'Hard', emoji: '🔴', color: 'text-red-400 border-red-400/50 hover:border-red-400' },
];

const DifficultySelector = ({ difficulty, onSelect }: DifficultySelectorProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground font-medium">Robot Difficulty</p>
      <div className="flex gap-2 sm:gap-3">
        {difficulties.map((d) => (
          <button
            key={d.value}
            onClick={() => onSelect(d.value)}
            className={cn(
              "px-3 py-2 sm:px-4 sm:py-2 rounded-lg border-2 font-display text-sm transition-all duration-200",
              d.color,
              difficulty === d.value 
                ? "bg-muted/50 scale-105" 
                : "border-border/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="mr-1">{d.emoji}</span>
            <span className="hidden sm:inline">{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
