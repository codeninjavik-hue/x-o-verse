import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OnlineMultiplayer = () => {
  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden flex items-center justify-center">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center justify-center p-6 rounded-2xl bg-muted/30 mb-8">
            <Globe className="w-16 h-16 sm:w-20 sm:h-20 text-accent animate-pulse" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-accent">Online</span>
            <span className="text-foreground"> Multiplayer</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Challenge players from around the world in real-time matches
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-12">
            <Wifi className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Coming Soon</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="neon" size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineMultiplayer;
