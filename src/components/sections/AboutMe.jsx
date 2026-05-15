import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../App';

const AboutMe = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.15 });
    const el = document.getElementById('about');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!data.about.visible) return null;

  const paragraphs = data.about.content.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);

  return (
    <div id="about" className="relative px-4 py-24 overflow-hidden">
      <div className={`max-w-3xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10">
          <div className="section-tag mb-4">about_me</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            The short version
          </h2>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
            <div className="terminal-dot" style={{ background: '#f59e0b' }}></div>
            <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>about.md</span>
          </div>
          <div className="p-6 md:p-8">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: idx < paragraphs.length - 1 ? '16px' : 0 }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
