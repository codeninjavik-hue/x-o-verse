import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: 'cyan' | 'magenta' | 'purple' | 'green' | 'orange';
}

const glowMap: Record<string, string> = {
  cyan: 'bg-primary/10',
  magenta: 'bg-secondary/10',
  purple: 'bg-accent/10',
  green: 'bg-neon-green/10',
  orange: 'bg-neon-orange/10',
};

const textMap: Record<string, string> = {
  cyan: 'text-primary',
  magenta: 'text-secondary',
  purple: 'text-accent',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
};

const ComingSoonPage = ({ title, description, icon: Icon, accentColor }: ComingSoonPageProps) => {
  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] ${glowMap[accentColor]} blur-[100px] rounded-full pointer-events-none`} />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
          </Link>
        </div>

        <div className="animate-scale-in">
          <div className="inline-flex p-6 rounded-2xl bg-muted/30 border border-border mb-6">
            <Icon className={`w-16 h-16 sm:w-20 sm:h-20 ${textMap[accentColor]}`} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
            <span className={textMap[accentColor]}>{title}</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            {description}
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/30 border border-border">
            <Clock className="w-5 h-5 text-muted-foreground animate-pulse" />
            <span className="font-display font-bold text-muted-foreground">COMING SOON</span>
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
