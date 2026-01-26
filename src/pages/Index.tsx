import { Users, Bot, Globe, Settings, Gamepad2, Zap, Trophy, Sparkles } from 'lucide-react';
import GameModeCard from '@/components/GameModeCard';
import { useEffect, useState } from 'react';

const Index = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger content animation after intro
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none animate-float" />

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 md:py-16 flex flex-col items-center">
        {/* Hero Section */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${showContent ? 'animate-slide-up' : 'opacity-0'}`}>
          {/* Animated Logo */}
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md transition-all duration-500 ${
                      [0, 4, 8].includes(i) ? 'bg-primary animate-pulse-glow' :
                      [2, 4, 6].includes(i) ? 'bg-secondary' :
                      'bg-muted/50'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-accent animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black mb-4">
            <span className="neon-text inline-block animate-float" style={{ animationDelay: '0.1s' }}>TIC TAC</span>
            <br />
            <span className="neon-text-magenta inline-block animate-float" style={{ animationDelay: '0.3s' }}>TOE ARENA</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto mb-6">
            Challenge your friends or battle the AI in this classic game reimagined with stunning neon graphics
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: Gamepad2, label: 'Multiple Modes', color: 'primary' },
              { icon: Zap, label: 'Real-time', color: 'secondary' },
              { icon: Trophy, label: 'Score Tracking', color: 'accent' },
            ].map((feature, i) => (
              <div
                key={feature.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border backdrop-blur-sm animate-slide-up`}
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <feature.icon className={`w-4 h-4 text-${feature.color}`} />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game Mode Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl transition-all duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
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
            title="Online Multiplayer"
            description="Play with anyone using room codes"
            accentColor="purple"
            delay={300}
          />
          <GameModeCard
            to="/settings"
            icon={Settings}
            title="Settings"
            description="Customize your experience"
            accentColor="muted"
            delay={400}
          />
        </div>

        {/* How to Play Section */}
        <div className={`mt-16 sm:mt-24 w-full max-w-4xl transition-all duration-700 ${showContent ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-8">
            <span className="text-primary">How to</span>
            <span className="text-foreground"> Play</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Choose Mode', desc: 'Select your preferred game mode from the options above' },
              { step: '2', title: 'Take Turns', desc: 'X goes first, then O. Click any empty cell to place your mark' },
              { step: '3', title: 'Win!', desc: 'Get 3 in a row horizontally, vertically, or diagonally' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="game-card p-6 text-center"
                style={{ animationDelay: `${700 + i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 sm:mt-24 text-center text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '900ms' }}>
          <p>Built with ❤️ using React & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
