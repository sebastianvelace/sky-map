import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, History, Telescope } from 'lucide-react';

interface NavbarProps {
  historyCount?: number;
}

const Navbar = ({ historyCount = 0 }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/gallery', icon: Compass, label: 'Constelaciones' },
    { path: '/history', icon: History, label: 'Historial', badge: historyCount },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-cosmic-gold/10 group-hover:bg-cosmic-gold/20 transition-colors">
              <Telescope className="w-5 h-5 text-cosmic-gold" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground hidden sm:block">
              Stars.ai
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map(({ path, icon: Icon, label, badge }) => (
              <Link
                key={path}
                to={path}
                className={`
                  relative flex items-center gap-2 px-3 py-2 rounded-xl
                  transition-all duration-300 text-sm font-medium
                  ${isActive(path) 
                    ? 'bg-cosmic-blue/20 text-cosmic-blue' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }
                `}
                aria-label={label}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
                
                {/* Badge for history count */}
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full px-1 animate-fade-in">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
