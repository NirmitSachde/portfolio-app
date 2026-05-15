import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Code, Database, Activity, Brain, Target, Zap, BarChart3 } from 'lucide-react';
import { usePortfolio } from '../../App';

const categoryIcons = {
  'Languages': Code, 'Database': Database, 'Tools': Activity, 'Libraries': Brain,
  'Frameworks & Methodologies': Target, 'Big Data & Cloud': Zap
};

const Skills = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    const el = document.getElementById('skills');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!data.about.visible) return null;

  const skillCategories = data.about.skillCategories || [];
  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

  const getRelatedProjects = (skill) => {
    if (!skill) return [];
    const lowerSkill = skill.toLowerCase();
    return data.projects.filter(p => {
      if (!p.visible) return false;
      return p.skills?.some(s => s.toLowerCase() === lowerSkill);
    });
  };

  const relatedProjects = getRelatedProjects(activeSkill);

  return (
    <div id="skills" className="relative px-4 py-24 overflow-hidden">
      <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-10">
          <div className="section-tag mb-4">cat skills.json</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Skills
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {totalSkills} skills across {skillCategories.length} categories // click any skill to see where it was used
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 space-y-6">
            {skillCategories.map((category, catIdx) => {
              const CategoryIcon = categoryIcons[category.category] || BarChart3;
              return (
                <div
                  key={catIdx}
                  className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${catIdx * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon size={16} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {category.category}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
                      ({category.skills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, idx) => (
                      <button
                        key={idx}
                        className={`skill-btn ${activeSkill === skill ? 'active' : ''}`}
                        onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results panel */}
          <div className="md:col-span-1">
            <div
              className="sticky top-24 transition-all duration-300"
              style={{
                background: activeSkill ? 'var(--bg-card)' : 'transparent',
                border: activeSkill ? '1px solid var(--border-accent)' : '1px solid transparent',
                borderRadius: '12px',
                padding: activeSkill ? '16px' : '0',
                minHeight: activeSkill ? '200px' : '0',
              }}
            >
              {activeSkill ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }}></div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: 'var(--accent-bright)' }}>
                      {activeSkill}
                    </span>
                  </div>

                  {relatedProjects.length > 0 ? (
                    <>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Used in {relatedProjects.length} project{relatedProjects.length > 1 ? 's' : ''}
                      </span>
                      <div className="mt-3 space-y-2">
                        {relatedProjects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="w-full text-left flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                          >
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-primary)' }}>
                              {project.title}
                            </span>
                            <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', marginTop: '12px' }}>
                      No projects tagged with this skill yet. Check back soon.
                    </p>
                  )}
                </>
              ) : (
                <div className="hidden md:flex items-center justify-center h-48">
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
                    Click a skill to see<br />related projects
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;