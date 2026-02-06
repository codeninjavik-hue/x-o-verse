import { useState, useEffect } from 'react';
import { Sparkles, Gamepad2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import GameCard from '@/components/GameCard';
import { gamesList, categories, GameCategory } from '@/data/gamesList';

const GameHub = () => {
  const [showContent, setShowContent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const filteredGames = gamesList.filter((game) => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const playableCount = gamesList.filter((g) => g.route).length;
  const totalCount = gamesList.length;

  return (
    <div className="min-h-screen grid-pattern relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none animate-float" />

      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-10">
        {/* Hero */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${showContent ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse-glow" />
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-3">
            <span className="neon-text inline-block">GAME</span>{' '}
            <span className="neon-text-magenta inline-block">ARENA</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-2">
            {totalCount}+ games — {playableCount} playable now, more coming soon!
          </p>
        </div>

        {/* Search */}
        <div className={`max-w-md mx-auto mb-6 transition-all duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/80 border-border"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
              activeCategory === 'all'
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
            )}
          >
            All Games ({totalCount})
          </button>
          {categories.map((cat) => {
            const count = gamesList.filter((g) => g.category === cat.id).length;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                  activeCategory === cat.id
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                )}
              >
                <CatIcon className="w-3.5 h-3.5" />
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          {filteredGames.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl font-display text-muted-foreground">No games found 😢</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search or category</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ — More games added regularly!</p>
        </footer>
      </div>
    </div>
  );
};

export default GameHub;
