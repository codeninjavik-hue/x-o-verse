import { Users, Bot, Globe, Settings } from 'lucide-react';
import GameModeCard from '@/components/GameModeCard';

const Index = () => {
  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col items-center">
        {/* Logo / Title */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary animate-pulse-glow" />
              <div className="w-3 h-3 rounded-sm bg-secondary" />
              <div className="w-3 h-3 rounded-sm bg-secondary" />
              <div className="w-3 h-3 rounded-sm bg-primary animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black mb-4">
            <span className="neon-text">TIC TAC</span>
            <br />
            <span className="neon-text-magenta">TOE ARENA</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
            Challenge your friends or battle the AI in this classic game reimagined
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
          <GameModeCard
            to="/pvp"
            icon={Users}
            title="Player vs Player"
            description="Challenge a friend in local multiplayer"
            accentColor="cyan"
            delay={100}
          />
          <GameModeCard
            to="/ai"
            icon={Bot}
            title="Player vs Robot"
            description="Test your skills against the AI"
            accentColor="magenta"
            delay={200}
          />
          <GameModeCard
            to="/online"
            icon={Globe}
            title="Online"
            description="Coming soon..."
            accentColor="muted"
            delay={300}
          />
          <GameModeCard
            to="/settings"
            icon={Settings}
            title="Settings"
            description="Customize your experience"
            accentColor="purple"
            delay={400}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 sm:mt-24 text-center text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '500ms' }}>
          <p>Built with ❤️ using React & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
