import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import { usePortfolio } from '../../App';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data } = usePortfolio();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (!isHomePage) {
      navigate('/#' + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', action: () => isHomePage ? scrollToSection('home') : navigate('/') },
    ...(data.about.visible ? [{ label: 'About', action: () => scrollToSection('about') }] : []),
    { label: 'Projects', action: () => scrollToSection('projects') },
    ...(data.about.visible ? [{ label: 'Skills', action: () => scrollToSection('skills') }] : []),
    { label: 'Why Hire Me', action: () => navigate('/why-hire-me'), highlight: true },
    ...(data.settings.showResume ? [{ label: 'Resume', action: () => scrollToSection('resume') }] : []),
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md border-b'
          : 'border-b border-transparent'
      }`}
      style={{
        background: scrolled ? 'rgba(6, 9, 15, 0.92)' : 'transparent',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)', fontSize: '18px' }}>
              {data.hero?.name?.split(' ')[0] || 'Portfolio'}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="px-3 py-1.5 rounded-md transition-all duration-200"
                style={{
                  fontFamily: item.highlight ? 'var(--font-mono)' : 'var(--font-body)',
                  fontSize: '13px',
                  color: item.highlight ? 'var(--accent-bright)' : 'var(--text-secondary)',
                  background: item.highlight ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  border: item.highlight ? '1px solid var(--border-accent)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = item.highlight ? '#93c5fd' : 'var(--text-primary)';
                  if (!item.highlight) e.target.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = item.highlight ? 'var(--accent-bright)' : 'var(--text-secondary)';
                  if (!item.highlight) e.target.style.background = 'transparent';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => { item.action(); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md transition-colors"
                style={{
                  fontFamily: item.highlight ? 'var(--font-mono)' : 'var(--font-body)',
                  fontSize: '14px',
                  color: item.highlight ? 'var(--accent-bright)' : 'var(--text-secondary)',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
