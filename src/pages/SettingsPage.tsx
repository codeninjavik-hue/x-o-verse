import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Palette, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            <span className="text-accent">Settings</span>
          </h1>

          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="game-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-primary" />
                ) : (
                  <VolumeX className="w-6 h-6 text-muted-foreground" />
                )}
                <div>
                  <h3 className="font-display font-semibold text-lg">Sound Effects</h3>
                  <p className="text-sm text-muted-foreground">Enable game sounds</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  "w-14 h-8 rounded-full transition-all duration-300 relative",
                  soundEnabled 
                    ? "bg-primary shadow-[0_0_15px_hsl(180_100%_50%/0.5)]" 
                    : "bg-muted"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-1 w-6 h-6 rounded-full bg-foreground transition-all duration-300",
                    soundEnabled ? "left-7" : "left-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Theme (Coming Soon) */}
          <div className="game-card p-6 opacity-60 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Palette className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="font-display font-semibold text-lg">Theme</h3>
                  <p className="text-sm text-muted-foreground">Customize colors and appearance</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Reset Data */}
          <div className="game-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <RotateCcw className="w-6 h-6 text-destructive" />
                <div>
                  <h3 className="font-display font-semibold text-lg">Reset All Data</h3>
                  <p className="text-sm text-muted-foreground">Clear all scores and preferences</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-12 text-center animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="font-display font-bold text-xl mb-4 text-muted-foreground">About</h2>
          <div className="game-card p-6">
            <h3 className="font-display font-bold text-2xl mb-2">
              <span className="neon-text">Tic Tac Toe</span>
              <span className="neon-text-magenta"> Arena</span>
            </h3>
            <p className="text-muted-foreground text-sm">Version 1.0.0</p>
            <p className="text-muted-foreground text-sm mt-2">
              A modern take on the classic game with AI opponent and multiplayer support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
