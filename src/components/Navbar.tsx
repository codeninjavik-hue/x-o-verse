import { Link, useLocation } from 'react-router-dom';
import { Users, Bot, Globe, Settings, Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/pvp', icon: Users, label: 'Player vs Player' },
  { to: '/ai', icon: Bot, label: 'Player vs Robot' },
  { to: '/online', icon: Globe, label: 'Online' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-sm bg-primary animate-pulse-glow" />
                <div className="w-2 h-2 rounded-sm bg-secondary" />
                <div className="w-2 h-2 rounded-sm bg-secondary" />
                <div className="w-2 h-2 rounded-sm bg-primary animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-primary">TIC TAC</span>
                <span className="text-secondary"> TOE</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                      "hover:bg-muted/50 hover:text-primary",
                      isActive && "bg-muted/70 text-primary neon-border"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isActive && "drop-shadow-[0_0_8px_hsl(180_100%_50%/0.8)]"
                    )} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 rounded-sm bg-primary" />
              <div className="w-2 h-2 rounded-sm bg-secondary" />
              <div className="w-2 h-2 rounded-sm bg-secondary" />
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <span className="font-display font-bold text-sm">
              <span className="text-primary">TIC TAC</span>
              <span className="text-secondary"> TOE</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-14 animate-fade-in">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300",
                    "hover:bg-muted/50 hover:text-primary",
                    isActive && "bg-muted/70 text-primary border border-primary/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive && "text-primary drop-shadow-[0_0_8px_hsl(180_100%_50%/0.8)]"
                  )} />
                  <span className="text-lg font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-14 md:h-16" />
    </>
  );
};

export default Navbar;
