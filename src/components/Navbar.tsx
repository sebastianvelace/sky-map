import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  historyCount?: number;
}

const Navbar = ({ historyCount = 0 }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/history', label: 'Historial', badge: historyCount },
  ];

  return (
    <nav className="relative z-10 w-full">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-16 items-center min-h-16">
          <div className="hidden xl:block" aria-hidden />
          <div className="flex items-center justify-center min-h-16 gap-20 sm:gap-24">
          {navItems.map(({ path, label, badge }) => (
            <Link
              key={path}
              to={path}
              className={`
                relative text-sm font-light tracking-widest uppercase
                transition-all duration-300
                ${isActive(path)
                  ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
                }
              `}
              aria-label={label}
            >
              {label}
              {isActive(path) && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-white/40" />
              )}
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-2 -right-4 text-[9px] text-slate-400 font-light">
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
