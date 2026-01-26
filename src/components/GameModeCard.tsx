import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameModeCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: 'cyan' | 'magenta' | 'purple' | 'muted';
  delay?: number;
}

const accentClasses = {
  cyan: 'group-hover:border-primary/70 group-hover:shadow-[0_0_30px_hsl(180_100%_50%/0.2)]',
  magenta: 'group-hover:border-secondary/70 group-hover:shadow-[0_0_30px_hsl(320_100%_60%/0.2)]',
  purple: 'group-hover:border-accent/70 group-hover:shadow-[0_0_30px_hsl(280_100%_65%/0.2)]',
  muted: 'group-hover:border-muted-foreground/50',
};

const iconClasses = {
  cyan: 'text-primary group-hover:drop-shadow-[0_0_10px_hsl(180_100%_50%/0.8)]',
  magenta: 'text-secondary group-hover:drop-shadow-[0_0_10px_hsl(320_100%_60%/0.8)]',
  purple: 'text-accent group-hover:drop-shadow-[0_0_10px_hsl(280_100%_65%/0.8)]',
  muted: 'text-muted-foreground',
};

const GameModeCard = ({ to, icon: Icon, title, description, accentColor, delay = 0 }: GameModeCardProps) => {
  return (
    <Link 
      to={to}
      className="group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        "game-card p-6 sm:p-8 h-full",
        accentClasses[accentColor]
      )}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className={cn(
            "p-4 rounded-xl bg-muted/50 transition-all duration-300",
            "group-hover:scale-110"
          )}>
            <Icon className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300",
              iconClasses[accentColor]
            )} />
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default GameModeCard;
