import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/shop?search=${encodeURIComponent(searchQ)}`);
    setSearchOpen(false);
  };

  const navLinks = [
    { label: 'New Arrivals', to: '/shop?sort=newest' },
    { label: 'Men', to: '/shop?gender=men' },
    { label: 'Women', to: '/shop?gender=women' },
    { label: 'Sale', to: '/shop?sale=true' },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brand-black text-brand-accent py-2 text-center text-xs font-mono tracking-widest uppercase overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          {Array(4).fill('BUY 1 GET 1 FREE (WINTER ONLY!) — FREE SHIPPING OVER 1000 EGP — NEW ARRIVALS EVERY WEEK — ').join('')}
        </div>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-brand-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="font-display text-3xl tracking-widest text-brand-black hover:text-brand-gray-600 transition-colors">
            NEXUS
            
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.label} to={l.to}
                className="text-sm font-semibold uppercase tracking-wider text-brand-gray-600 hover:text-brand-black transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-brand-gray-500 transition-colors">
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative group hidden lg:block">
                <button className="p-2 flex items-center gap-1 text-sm font-semibold">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-brand-gray-200 shadow-lg w-44 hidden group-hover:block">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-brand-gray-100">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-brand-gray-100 w-full text-left">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:block text-sm font-semibold uppercase tracking-wider hover:text-brand-gray-500">
                Login
              </Link>
            )}

            <Link to="/cart" className="p-2 relative">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-brand-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-brand-gray-200 bg-white px-4 py-3 animate-fade-in">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <input
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search products..."
                className="input-field"
              />
              <button type="submit" className="btn-primary px-6 py-3">GO</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-brand-gray-200 bg-white animate-fade-in">
            {navLinks.map(l => (
              <Link key={l.label} to={l.to}
                className="block px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b border-brand-gray-100 hover:bg-brand-gray-100">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="block px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b border-brand-gray-100">Admin Dashboard</Link>}
                <button onClick={logout} className="block w-full text-left px-6 py-4 text-sm font-semibold uppercase tracking-wider">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-6 py-4 text-sm font-semibold uppercase tracking-wider">Login / Register</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
