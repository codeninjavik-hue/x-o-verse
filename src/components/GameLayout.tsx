import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
  onRestart?: () => void;
  rules?: string;
  score?: React.ReactNode;
  accentColor?: string;
}

const colorMap: Record<string, string> = {
  cyan: 'text-primary',
  magenta: 'text-secondary',
  purple: 'text-accent',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
};

const GameLayout = ({ title, children, onRestart, rules, score, accentColor = 'cyan' }: GameLayoutProps) => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <h1 className={`text-xl sm:text-2xl font-display font-bold ${colorMap[accentColor] || 'text-primary'}`}>{title}</h1>
          <div className="flex gap-1">
            {rules && (
              <Button variant="ghost" size="icon" onClick={() => setShowRules(true)}>
                <HelpCircle className="w-5 h-5" />
              </Button>
            )}
            {onRestart && (
              <Button variant="ghost" size="icon" onClick={onRestart}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {score && <div className="text-center mb-4">{score}</div>}

        <div className="flex flex-col items-center">{children}</div>

        {showRules && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowRules(false)}>
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-bold text-lg">How to Play</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowRules(false)}><X className="w-4 h-4" /></Button>
              </div>
              <p className="text-muted-foreground whitespace-pre-line text-sm">{rules}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLayout;
