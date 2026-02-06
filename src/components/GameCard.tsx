import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { GameItem } from '@/data/gamesList';

const accentGlow: Record<string, string> = {
  cyan: 'group-hover:border-primary/70 group-hover:shadow-[0_0_25px_hsl(180_100%_50%/0.15)]',
  magenta: 'group-hover:border-secondary/70 group-hover:shadow-[0_0_25px_hsl(320_100%_60%/0.15)]',
  purple: 'group-hover:border-accent/70 group-hover:shadow-[0_0_25px_hsl(280_100%_65%/0.15)]',
  green: 'group-hover:border-neon-green/70 group-hover:shadow-[0_0_25px_hsl(150_100%_50%/0.15)]',
  orange: 'group-hover:border-neon-orange/70 group-hover:shadow-[0_0_25px_hsl(30_100%_55%/0.15)]',
};

const iconColor: Record<string, string> = {
  cyan: 'text-primary',
  magenta: 'text-secondary',
  purple: 'text-accent',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
};

const badgeColor: Record<string, string> = {
  new: 'bg-neon-green/20 text-neon-green border-neon-green/40',
  hot: 'bg-neon-orange/20 text-neon-orange border-neon-orange/40',
  soon: 'bg-muted text-muted-foreground border-border',
};

interface GameCardProps {
  game: GameItem;
  index: number;
}

const GameCard = ({ game, index }: GameCardProps) => {
  const isComingSoon = !game.route;
  const Icon = game.icon;

  const content = (
    <div
      className={cn(
        'game-card p-4 sm:p-5 h-full relative',
        accentGlow[game.accentColor],
        isComingSoon && 'opacity-60 cursor-not-allowed'
      )}
    >
      {/* Badge */}
      <div className="absolute top-2 right-2">
        {game.isNew && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider', badgeColor.new)}>
            New
          </span>
        )}
        {game.isHot && !game.isNew && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider', badgeColor.hot)}>
            Hot
          </span>
        )}
        {isComingSoon && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider', badgeColor.soon)}>
            Soon
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2.5 rounded-lg bg-muted/50 shrink-0 transition-transform duration-300',
          !isComingSoon && 'group-hover:scale-110'
        )}>
          {isComingSoon ? (
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          ) : (
            <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300', iconColor[game.accentColor])} />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-display font-bold text-foreground truncate">
            {game.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {game.description}
          </p>
        </div>
      </div>
    </div>
  );

  if (isComingSoon) {
    return (
      <div
        className="group animate-slide-up"
        style={{ animationDelay: `${Math.min(index * 30, 500)}ms` }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={game.route!}
      className="group animate-slide-up"
      style={{ animationDelay: `${Math.min(index * 30, 500)}ms` }}
    >
      {content}
    </Link>
  );
};

export default GameCard;
