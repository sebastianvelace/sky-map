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
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 glass-navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-400/20 transition-all duration-300 group-hover:bg-violet-500/20 group-hover:shadow-[0_0_18px_rgba(139,92,246,0.45)]">
              <Telescope className="w-5 h-5 text-violet-300 transition-all duration-300 group-hover:text-violet-200 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground hidden sm:block tracking-wide">
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
                  group relative flex items-center gap-2 px-3 py-2 rounded-xl
                  border border-transparent transition-all duration-300 text-sm font-medium
                  ${isActive(path) 
                    ? 'bg-violet-500/15 text-violet-200 border-violet-300/40 shadow-[0_0_18px_rgba(139,92,246,0.3)]' 
                    : 'text-slate-300 hover:text-slate-100 hover:bg-white/5 hover:border-white/10'
                  }
                `}
                aria-label={label}
              >
                <Icon
                  size={18}
                  className={`transition-all duration-300 ${
                    isActive(path)
                      ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.9)]'
                      : 'group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.75)]'
                  }`}
                />
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
