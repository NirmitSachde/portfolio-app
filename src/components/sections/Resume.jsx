import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { usePortfolio } from '../../App';

const Resume = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    const el = document.getElementById('resume');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!data.settings.showResume) return null;
  const visibleResumes = data.resumes.filter(r => r.visible);

  const getGoogleDrivePreviewUrl = (fileId) => `https://drive.google.com/file/d/${fileId}/preview`;
  const getGoogleDriveDownloadUrl = (fileId) => `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <div id="resume" className="px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-tag mb-4">cat resume.pdf</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>Resume</h2>
        </div>

        <div className="space-y-8">
          {visibleResumes.map((resume, idx) => (
            <div
              key={resume.id}
              className={`glow-card overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="p-5 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {resume.title}
                </h3>
                <a
                  href={getGoogleDriveDownloadUrl(resume.driveFileId)}
                  download
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
                  style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dim)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                >
                  <Download size={14} /> Download
                </a>
              </div>
              <div className="aspect-[8.5/11] relative" style={{ background: 'var(--bg-surface)' }}>
                <iframe
                  src={getGoogleDrivePreviewUrl(resume.driveFileId)}
                  className="w-full h-full"
                  title={resume.title}
                  sandbox="allow-same-origin allow-scripts"
                  style={{ pointerEvents: 'none' }}
                />
                <div className="absolute inset-0" style={{ pointerEvents: 'auto' }} onContextMenu={(e) => e.preventDefault()} />
              </div>
            </div>
          ))}
          {visibleResumes.length === 0 && (
            <p className="text-center" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              No resumes available. Add some from the admin panel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
