import React, { useState, useEffect } from 'react';
import { ChevronDown, BarChart3, Database, TrendingUp, Brain, Activity } from 'lucide-react';
import { usePortfolio } from '../../App';

const Hero = () => {
  const { data } = usePortfolio();
  const [displayedName, setDisplayedName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    let index = 0;
    const name = data.hero.name;
    const typingInterval = setInterval(() => {
      if (index < name.length) {
        setDisplayedName(name.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => { clearInterval(typingInterval); clearInterval(cursorInterval); };
  }, [data.hero.name]);

  if (!data.hero.visible) return null;

  const scrollToNext = () => {
    const nextSection = data.about.visible ? 'about' : 'projects';
    document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' });
  };

  const floatingIcons = [
    { Icon: BarChart3, top: '18%', left: '8%', delay: 0 },
    { Icon: Database, top: '28%', right: '12%', delay: 1.2 },
    { Icon: TrendingUp, bottom: '22%', left: '12%', delay: 0.6 },
    { Icon: Brain, bottom: '28%', right: '8%', delay: 1.8 },
    { Icon: Activity, top: '42%', left: '4%', delay: 2.4 },
  ];

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      {floatingIcons.map(({ Icon, delay, ...pos }, i) => (
        <div
          key={i}
          className="absolute hidden md:block"
          style={{ ...pos, opacity: 0.06, animation: `float 7s ease-in-out ${delay}s infinite` }}
        >
          <Icon size={52} style={{ color: 'var(--accent)' }} />
        </div>
      ))}

      <div className={`text-center max-w-3xl z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="terminal-window inline-block text-left mb-8 max-w-lg w-full">
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
            <div className="terminal-dot" style={{ background: '#f59e0b' }}></div>
            <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>portfolio.sh</span>
          </div>
          <div className="terminal-body">
            <div>
              <span style={{ color: 'var(--green)' }}>$ </span>
              <span style={{ color: 'var(--text-muted)' }}>whoami</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 6vw, 48px)', color: 'var(--accent-bright)', lineHeight: 1.1, margin: '4px 0' }}>
              {displayedName}
              <span className="cursor-blink inline-block ml-0.5" style={{ width: '3px', height: '0.9em', background: 'var(--accent)', verticalAlign: 'baseline' }}></span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {data.hero.title.split('|').map((role, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--border-bright)', fontSize: '14px' }}>/</span>}
              <span
                className="px-3 py-1 rounded-md"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--accent-bright)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                {role.trim()}
              </span>
            </React.Fragment>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 32px' }}>
          {data.hero.description}
        </p>

        <button onClick={scrollToNext} className="animate-bounce" style={{ color: 'var(--accent)' }}>
          <ChevronDown size={28} />
        </button>
      </div>
    </div>
  );
};

export default Hero;
