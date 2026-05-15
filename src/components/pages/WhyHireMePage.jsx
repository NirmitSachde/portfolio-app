import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, User, Users, Crown, Briefcase, Target, Code, ArrowUpRight } from 'lucide-react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { usePortfolio } from '../../App';

const roles = [
  { id: 'recruiter', label: 'Recruiter', icon: User, desc: 'Sourcing talent for data roles',
    intro: 'I am every skill on your checklist. Not because I memorized a list, but because I have built something real with each one. I am always adding to what I know, and I do not wait to be told what to learn next. If the role needs it, I have either done it or I am already figuring it out.' },
  { id: 'teamlead', label: 'Team Lead', icon: Users, desc: 'Building or growing a data team',
    intro: 'I do not need to be managed into productivity. Point me at a problem and I will break it down, build it out and keep you in the loop without being asked. I have worked across analytics, engineering and science roles, so I know how to fit into a team and make the people around me faster.' },
  { id: 'executive', label: 'CEO / CTO', icon: Crown, desc: 'Looking for data-driven impact',
    intro: 'I translate data into decisions. Every project I have shipped started with a business question and ended with something someone could act on. I think about the whole picture, not just the code, and I take ownership from requirements through delivery. I lead when the work calls for it and I execute when it does not.' },
  { id: 'manager', label: 'Manager', icon: Briefcase, desc: 'Hiring for your direct team',
    intro: 'You will not have to explain things twice. I pick up context fast, I ask the right questions early, and I ship work that does not come back with revision requests. I have delivered across dashboards, pipelines, ML models and client-facing tools, so whatever your team needs next, I can start contributing from day one.' },
  { id: 'product', label: 'Product Owner', icon: Target, desc: 'Need analytics support for product',
    intro: 'You can hand me the product and I will take care of it. I have built and maintained data products end to end, from gathering requirements and writing specs to building the thing and iterating on user feedback. I know what it takes to keep a product running and improving, not just launched.' },
  { id: 'engineer', label: 'Engineer', icon: Code, desc: 'Looking for a data collaborator',
    intro: 'I write clean code, I document what I build, and I do not push things that break. I have worked with Python, SQL, R, JavaScript, React, FastAPI and a bunch of cloud and ML tooling. I care about how things are built, not just that they work, and I am always looking to learn the way your team does things.' },
];


// Skill-to-proof mapping based on Nirmit's actual work
// Projects are matched dynamically from Firebase skills arrays — no hardcoded project names
const skillProofs = {
  'Python': {
    where: 'Used across every project and role. Primary language for data pipelines, ML models, dashboards and API backends.',
    inspiration: 'It is what I reach for first whether I am building a data pipeline, running EDA in a notebook, or training a classification model. The ecosystem (Pandas, NumPy, Scikit-learn, Plotly, FastAPI) lets me go from raw data to a working product without switching contexts.',
  },
  'SQL': {
    where: 'Database design, stored procedures, complex queries for trend analysis. Used in academic data warehousing projects and at Techathalon for MySQL schema design.',
    inspiration: 'Needed to optimize queries on large datasets for real-time dashboards. Learned that good schema design is half the battle.',
  },
  'plotly': {
    where: 'Built interactive dashboards and visualizations across multiple projects. Scatter maps, heatmaps, time series and choropleth maps.',
    inspiration: 'Static charts only show one angle. Plotly lets the viewer explore the data and find their own story.',
  },
  'dash': {
    where: 'Built multi-page interactive dashboards with sliders, gauges and dynamic filtering for geospatial and analytical projects.',
    inspiration: 'Replaced a static Excel model that an engineer had been using for years. The interactive version lets you explore trade-offs in real time instead of manually changing cells.',
  },
  'Machine Learning': {
    where: 'Scikit-learn, RandomForest, CatBoost, Gradient Boosting for healthcare prediction. NetworkX and Elo ratings for esports match prediction.',
    inspiration: 'The Valorant project started because I play Valorant and wanted to predict match outcomes. Turned into a full pipeline with 84% accuracy.',
  },
  'NLP': {
    where: 'Built dual-approach NLP pipelines for SEC 10-K filings. DistilBART for summarization, KeyBERT for keyword extraction.',
    inspiration: 'Wanted to see if machines could extract the same insights from financial documents that an analyst spends hours reading.',
  },
  'Data Visualization': {
    where: 'Plotly, Flourish, Datawrapper, Leaflet, Matplotlib, Seaborn. Built interactive storytelling sites and dashboards across every project.',
    inspiration: 'Started from a Reddit post where someone tried to answer a race-start question with a hand-colored Excel table full of errors. I pulled the data properly and built something visual.',
  },
  'Geospatial': {
    where: 'GeoPandas with shapefiles for choropleth visualizations, Leaflet for interactive maps, heatmaps for spatial density analysis.',
    inspiration: 'Built county-level choropleth maps of EV adoption across Washington State, integrating census and income data to find patterns.',
  },
  'Deep Learning': {
    where: 'TensorFlow/Keras for CNNs on image data. ResNet-50 transfer learning for activity recognition. Data augmentation and regularization.',
    inspiration: 'Wanted to understand how machines classify visual patterns. Built a 15-category human activity classifier from 12,000+ images.',
  },
  'scikit-learn': {
    where: 'Core ML library for classification, regression and model evaluation across healthcare and esports projects.',
    inspiration: 'The consistent API design makes it easy to experiment with different algorithms and compare results without rewriting code.',
  },
  'pandas': {
    where: 'Data wrangling, cleaning and transformation across every Python project. The backbone of every analysis pipeline.',
    inspiration: 'Every dataset arrives messy. Pandas is how I make sense of it before any modeling or visualization begins.',
  },
  'geopandas': {
    where: 'Shapefile processing, choropleth maps, spatial joins for geographic analysis of EV adoption, crime and crash data.',
    inspiration: 'Standard charts cannot show where things happen. GeoPandas lets me map data to geography and find spatial patterns.',
  },
};

const WhyHireMePage = () => {
  const { data } = usePortfolio();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [typedText, setTypedText] = useState('');

  const availableSkills = Object.keys(skillProofs);

  const areas = [
    { id: 'DA', label: 'Data Analysis' },
    { id: 'DS', label: 'Data Science' },
    { id: 'DE', label: 'Data Engineering' },
    { id: 'DV', label: 'Data Visualization' },
    { id: 'ML', label: 'Machine Learning' },
    { id: 'NLP', label: 'Natural Language Processing' },
    { id: 'BI', label: 'Business Intelligence' },
  ];

  // Typing effect for prompts
  useEffect(() => {
    const prompts = {
      1: '$ identify --role',
      2: '$ query --skills "what do you need?"',
      3: `$ generate_report --for="${selectedRole?.label || 'you'}"`,
    };
    const text = prompts[step] || '';
    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      if (i <= text.length) {
        setTypedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [step, selectedRole]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleArea = (areaId) => {
    setSelectedAreas(prev =>
      prev.includes(areaId) ? prev.filter(a => a !== areaId) : [...prev, areaId]
    );
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setTimeout(() => setStep(2), 400);
  };

  const handleContinue = () => {
    if (selectedSkills.length > 0 || selectedAreas.length > 0) setStep(3);
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 transition-colors"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-bright)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} /> cd ~/home
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="section-tag mb-4">./why-hire-me</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '12px' }}>
            Why hire {data.hero?.name?.split(' ')[0] || 'me'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Let me show you exactly where and how I have used the skills you are looking for. No fluff, just proof.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300"
                style={{
                  background: step >= s ? 'var(--accent)' : 'var(--bg-surface)',
                  border: `1px solid ${step >= s ? 'var(--accent)' : 'var(--border)'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: step >= s ? '#fff' : 'var(--text-dim)',
                }}
              >
                {s}
              </div>
              {s < 3 && (
                <div className="flex-1 h-px" style={{ background: step > s ? 'var(--accent)' : 'var(--border)' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Terminal window for each step */}
        <div className="terminal-window mb-8">
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
            <div className="terminal-dot" style={{ background: '#f59e0b' }}></div>
            <div className="terminal-dot" style={{ background: '#22c55e' }}></div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>
              {step === 1 ? 'role_select.sh' : step === 2 ? 'skill_query.sh' : 'report.sh'}
            </span>
          </div>
          <div className="terminal-body">
            <div className="mb-4">
              <span style={{ color: 'var(--green)' }}>{typedText}</span>
              <span className="cursor-blink" style={{ display: 'inline-block', width: '7px', height: '14px', background: 'var(--green)', marginLeft: '2px', verticalAlign: 'text-bottom' }}></span>
            </div>

            {/* STEP 1: Role selection */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '13px' }}>
                  Select your role so I can tailor this for you:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map(role => {
                    const Icon = role.icon;
                    const isSelected = selectedRole?.id === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className="text-left p-4 rounded-lg transition-all duration-200"
                        style={{
                          background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-elevated)',
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-bright)'; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <Icon size={18} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{role.label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{role.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Skill selection */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                {/* Role-tailored intro paragraph */}
                {selectedRole?.intro && (
                  <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid var(--border-accent)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {selectedRole.intro}
                    </p>
                  </div>
                )}

                {/* Areas of expertise */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Areas of expertise
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                      — filter by domain
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areas.map(area => {
                      const isActive = selectedAreas.includes(area.id);
                      return (
                        <button
                          key={area.id}
                          onClick={() => toggleArea(area.id)}
                          style={{
                            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: isActive ? 600 : 400,
                            padding: '5px 14px', borderRadius: '999px', cursor: 'pointer',
                            background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-elevated)',
                            color: isActive ? 'var(--accent-bright)' : 'var(--text-muted)',
                            border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                          onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
                        >
                          {area.id} — {area.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Skills
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
                      — pick what matters for the role
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`skill-btn ${selectedSkills.includes(skill) ? 'active' : ''}`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {(selectedSkills.length > 0 || selectedAreas.length > 0) && (
                  <button
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200"
                    style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-dim)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                  >
                    Generate report ({selectedSkills.length + selectedAreas.length} selected)
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* STEP 3: Results */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <p style={{ color: 'var(--green)', marginBottom: '4px', fontSize: '13px' }}>
                  Report generated. {selectedAreas.length > 0 ? `${selectedAreas.length} area${selectedAreas.length > 1 ? 's' : ''}` : ''}{selectedAreas.length > 0 && selectedSkills.length > 0 ? ' + ' : ''}{selectedSkills.length > 0 ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''}` : ''} matched.
                </p>
                <p style={{ color: 'var(--text-dim)', marginBottom: '16px', fontSize: '12px' }}>
                  Scroll down to see the details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step navigation */}
        {step > 1 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mb-6 transition-colors"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            Go back
          </button>
        )}

        {/* PROOF CARDS (Step 3) */}
        {step === 3 && (
          <div className="space-y-6 stagger-children">

            {/* Area-based project cards */}
            {selectedAreas.length > 0 && selectedAreas.map(areaId => {
              const area = areas.find(a => a.id === areaId);
              const areaProjects = data.projects.filter(p =>
                p.visible && p.tags?.some(t => t.toUpperCase() === areaId.toUpperCase())
              );
              return (
                <div key={areaId} className="glow-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }}></div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--accent-bright)' }}>
                          {area?.label || areaId}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent)', border: '1px solid var(--border-accent)', fontWeight: 600 }}>
                          {areaId}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
                      {areaProjects.length} project{areaProjects.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {areaProjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {areaProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => navigate(`/project/${project.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200"
                          style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent-bright)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          {project.title}
                          <ArrowUpRight size={10} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dim)' }}>
                      No projects tagged with this area yet.
                    </p>
                  )}
                </div>
              );
            })}

            {/* Skill proof cards */}
            {selectedSkills.map(skill => {
              const proof = skillProofs[skill];
              if (!proof) return null;
              return (
                <div key={skill} className="glow-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }}></div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--accent-bright)' }}>
                          {skill}
                        </h3>
                      </div>
                    </div>
                    {(() => {
                      const count = data.projects.filter(p =>
                        p.visible && p.skills?.some(s => s.toLowerCase() === skill.toLowerCase())
                      ).length;
                      return count > 0 ? (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
                          {count} project{count > 1 ? 's' : ''}
                        </span>
                      ) : null;
                    })()}
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                    {proof.where}
                  </p>

                  {/* Inspiration */}
                  <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      The story behind it
                    </span>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '6px' }}>
                      {proof.inspiration}
                    </p>
                  </div>

                  {/* Related projects — dynamically matched from project skills in Firebase */}
                  {(() => {
                    const matchedProjects = data.projects.filter(p =>
                      p.visible && p.skills?.some(s => s.toLowerCase() === skill.toLowerCase())
                    );
                    return matchedProjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {matchedProjects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200"
                            style={{
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent-bright)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            {project.title}
                            <ArrowUpRight size={10} />
                          </button>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>
              );
            })}

            {/* CTA at the bottom */}
            <div className="terminal-window mt-8">
              <div className="terminal-body">
                <p style={{ color: 'var(--green)', marginBottom: '8px' }}>$ echo "Convinced yet?"</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                  If you want to dig deeper into any project, click through to its detail page. Or reach out directly.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={`mailto:${data.contact?.personalEmail?.value || 'sachde.n@northeastern.edu'}`}
                    className="px-4 py-2 rounded-lg transition-all duration-200"
                    style={{ background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                  >
                    Send me an email
                  </a>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 rounded-lg transition-all duration-200"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px', border: '1px solid var(--border)' }}
                  >
                    Back to portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WhyHireMePage;