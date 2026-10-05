import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Home, History, Heart, Clock, Settings, Shield } from 'lucide-react';
import { useState } from 'react';
import { getSettings } from '../services/storage';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const settings = getSettings();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/history', label: 'History', icon: History },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/watch-later', label: 'Watch Later', icon: Clock },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-vt-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-vt-surface/95 backdrop-blur-sm border-b border-vt-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vt-accent to-vt-accent-light flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-semibold text-vt-text hidden sm:block">
              VibeTube
            </span>
            {settings.educationMode && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-vt-accent/20 text-vt-accent-light rounded-full flex items-center gap-1">
                <Shield size={10} />
                EDU
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-vt-accent/15 text-vt-accent-light'
                    : 'text-vt-text-muted hover:text-vt-text hover:bg-vt-surface-2'
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-vt-surface-2 text-vt-text-muted"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-vt-border bg-vt-surface px-4 py-2 animate-fade-in">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-vt-accent/15 text-vt-accent-light'
                    : 'text-vt-text-muted hover:text-vt-text'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-vt-border py-4 text-center">
        <p className="text-xs text-vt-text-muted">
          VibeTube — Clean Video Experience • V1
        </p>
      </footer>
    </div>
  );
}
