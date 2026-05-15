import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Download, Code, ArrowUpRight } from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { usePortfolio } from '../../App';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { data } = usePortfolio();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const project = data.projects.find(p => String(p.id) === String(projectId));

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!project) {
    return (
      <div className="grid-bg" style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-32 text-center">
          <div className="terminal-window inline-block text-left">
            <div className="terminal-header">
              <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
              <div className="terminal-dot" style={{ background: '#f59e0b' }}></div>
              <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
            </div>
            <div className="terminal-body">
              <p><span style={{ color: 'var(--red)' }}>Error 404:</span> Project not found</p>
              <p style={{ color: 'var(--text-dim)', marginTop: '8px' }}>$ The requested project does not exist or has been removed.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-8 flex items-center gap-2 mx-auto transition-colors"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-bright)' }}
          >
            <ArrowLeft size={14} /> cd ~/home
          </button>
        </div>
      </div>
    );
  }

  // Find related projects (shared skills)
  const relatedProjects = data.projects.filter(p => {
    if (p.id === project.id || !p.visible) return false;
    if (!project.skills || !p.skills) return false;
    return project.skills.some(s => p.skills?.includes(s));
  }).slice(0, 3);

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-bright)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} /> cd ..
        </button>

        {/* Cover image */}
        {project.coverPhoto && (
          <div
            className={`rounded-xl overflow-hidden mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ maxHeight: '360px', border: '1px solid var(--border)' }}
          >
            <img src={project.coverPhoto} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title + meta */}
        <div className={`mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-tag mb-4">project/{project.id}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '16px' }}>
            {project.title}
          </h1>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-bright)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Github size={14} /> View source
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                style={{ background: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff' }}
              >
                <ExternalLink size={14} /> Live demo
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className={`mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
                <div className="terminal-dot" style={{ background: '#f59e0b' }}></div>
                <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>README.md</span>
              </div>
              <div className="p-6">
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inspiration / Why I built this */}
        {project.inspiration && (
          <div className={`mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Why I built this
            </h3>
            <div className="glow-card p-5">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {project.inspiration}
              </p>
            </div>
          </div>
        )}

        {/* What was done */}
        {project.whatWasDone && project.whatWasDone.length > 0 && (
          <div className={`mb-8 transition-all duration-700 delay-[350ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              What was done
            </h3>
            <div className="space-y-2">
              {project.whatWasDone.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent)' }}></div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className={`mb-8 transition-all duration-700 delay-[400ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Technologies used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, i) => (
                <span key={i} className="skill-btn">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Additional files */}
        {project.additionalFiles && project.additionalFiles.length > 0 && (
          <div className={`mb-8 transition-all duration-700 delay-[450ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Files
            </h3>
            <div className="space-y-2">
              {project.additionalFiles.map((file, i) => (
                <a
                  key={i}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <Download size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>{file.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="data-line mb-8"></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Related projects
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedProjects.map(rp => (
                <button
                  key={rp.id}
                  onClick={() => navigate(`/project/${rp.id}`)}
                  className="glow-card text-left p-4 transition-all duration-200"
                >
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {rp.title}
                  </h4>
                  {rp.description && (
                    <p className="line-clamp-2" style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {rp.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>
                    View <ArrowUpRight size={10} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
