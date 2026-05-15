import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ExternalLink, ArrowUpRight, Code, Database, Download } from 'lucide-react';
import { usePortfolio } from '../../App';

const Projects = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const visibleProjects = data.projects.filter(p => p.visible);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.05 });
    const el = document.getElementById('projects');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getFileIcon = (fileName) => {
    const ext = fileName?.toLowerCase().split('.').pop();
    if (['py', 'ipynb', 'js'].includes(ext)) return Code;
    if (['csv', 'xlsx', 'xls'].includes(ext)) return Database;
    return Download;
  };

  return (
    <div id="projects" className="relative px-4 py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-tag mb-4">ls ~/projects</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Projects
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {visibleProjects.map((project, idx) => (
            <div
              key={project.id}
              className={`glow-card overflow-hidden cursor-pointer group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 80}ms` }}
              onClick={() => navigate(`/project/${project.id}`)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              {/* Cover image */}
              <div style={{ height: '180px', background: 'var(--bg-elevated)', position: 'relative', overflow: 'hidden' }}>
                {project.coverPhoto ? (
                  <img src={project.coverPhoto} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code size={40} style={{ color: 'var(--accent)', opacity: 0.15 }} />
                  </div>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(6, 9, 15, 0.8)', border: '1px solid var(--border)' }}>
                    <ArrowUpRight size={14} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}
                  className="group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="line-clamp-2 mb-3" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                )}

                {/* Inspiration */}
                {project.inspiration && (
                  <div className="mb-3 p-3 rounded-md" style={{ background: 'rgba(59, 130, 246, 0.04)', border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Why I built this
                    </span>
                    <p className="line-clamp-2 mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {project.inspiration}
                    </p>
                  </div>
                )}

                {/* Skills tags */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.skills.slice(0, 4).map((skill, i) => (
                      <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 4 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', color: 'var(--text-dim)' }}>
                        +{project.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors" style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--accent-bright)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                      <Github size={12} /> Code
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors" style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--accent-bright)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <p className="text-center" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            No projects yet. Add some from the admin panel.
          </p>
        )}
      </div>
    </div>
  );
};

export default Projects;
