import React, { createContext, useContext, useState, useEffect } from 'react';
import { Menu, X, Laptop, ExternalLink, Github, Download, Eye, EyeOff, Save, Plus, Trash2, LogOut, BarChart3, Database, TrendingUp, PieChart, LineChart, Activity, Code, Brain, Zap, Target, Lightbulb, ChevronDown, Mail, Phone, Linkedin, Instagram, Twitter } from 'lucide-react';
import { db, auth } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const PortfolioContext = createContext();

const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};

const initialData = {
  hero: {
    name: "Your Name",
    title: "Data Analyst | Business Analyst | Data Scientist",
    description: "Recent graduate passionate about turning data into actionable insights. Experienced in data analysis, visualization, and machine learning.",
    visible: true
  },
  about: {
    content: "I'm a recent graduate with a strong foundation in data analytics and business intelligence. My experience spans across data engineering, statistical analysis, and machine learning. I'm passionate about solving complex problems with data-driven solutions.",
    skillCategories: [
      {
        category: "Languages",
        skills: ["Python", "R", "SQL", "HTML", "JavaScript", "C"]
      },
      {
        category: "Database",
        skills: ["MongoDB", "Firebase", "MySQL", "Oracle", "PostgreSQL", "SQLite"]
      },
      {
        category: "Tools",
        skills: ["Tableau", "MySQL Workbench", "AWS Glue", "Microsoft Excel", "Power BI", "Salesforce", "JIRA", "Power Apps", "Power Automate", "SharePoint"]
      },
      {
        category: "Libraries",
        skills: ["pandas", "seaborn", "matplotlib", "scikit-learn", "scipy", "TensorFlow", "Keras", "PyTorch", "plotly", "dash", "geopandas", "ArcGIS"]
      },
      {
        category: "Frameworks & Methodologies",
        skills: ["Agile", "Scrum", "Sprint Planning", "Stand-ups", "Retrospectives"]
      },
      {
        category: "Big Data & Cloud",
        skills: ["AWS Glue", "Spark", "Hadoop"]
      }
    ],
    visible: true
  },
  projects: [],
  resumes: [],
  contact: {
    personalEmail: { value: "", visible: true },
    orgEmail: { value: "", visible: true },
    phone: { value: "", visible: true },
    linkedin: { value: "", visible: true },
    github: { value: "", visible: true },
    instagram: { value: "", visible: true },
    twitter: { value: "", visible: true }
  },
  settings: {
    showResume: true
  }
};

const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'portfolio', 'data'),
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setDoc(doc(db, 'portfolio', 'data'), initialData);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveToFirebase = async (newData) => {
    try {
      await setDoc(doc(db, 'portfolio', 'data'), newData);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const updateSection = (section, newData) => {
    const updatedData = {
      ...data,
      [section]: { ...data[section], ...newData }
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const addProject = (project) => {
    const updatedData = {
      ...data,
      projects: [...data.projects, { ...project, id: Date.now(), visible: true }]
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const updateProject = (id, updates) => {
    const updatedData = {
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const deleteProject = (id) => {
    const updatedData = {
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const addResume = (resume) => {
    const updatedData = {
      ...data,
      resumes: [...data.resumes, { ...resume, id: Date.now(), visible: true }]
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const updateResume = (id, updates) => {
    const updatedData = {
      ...data,
      resumes: data.resumes.map(r => r.id === id ? { ...r, ...updates } : r)
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const deleteResume = (id) => {
    const updatedData = {
      ...data,
      resumes: data.resumes.filter(r => r.id !== id)
    };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <PortfolioContext.Provider value={{
      data,
      updateSection,
      addProject,
      updateProject,
      deleteProject,
      addResume,
      updateResume,
      deleteResume
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

const FloatingIcon = ({ Icon, delay = 0, position }) => {
  return (
    <div 
      className="absolute opacity-10"
      style={{
        ...position,
        animation: `float 6s ease-in-out ${delay}s infinite`
      }}
    >
      <Icon className="w-16 h-16 text-blue-400" />
    </div>
  );
};

const LaptopFrame = ({ image, title }) => {
  return (
    <div className="relative w-full transform transition-transform duration-300 hover:scale-105">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl p-2 shadow-2xl">
        <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-blue-400 text-xl font-semibold px-4 text-center">
              {title}
            </div>
          )}
        </div>
      </div>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 h-2 rounded-b-xl"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-t-lg"></div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-sm border-gray-800 shadow-lg' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 text-xl font-bold text-blue-400">
            <BarChart3 className="w-6 h-6" />
            <span>Portfolio</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-blue-400 transition">Home</button>
            {data.about.visible && <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-blue-400 transition">About</button>}
            <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:text-blue-400 transition">Projects</button>
            {data.settings.showResume && <button onClick={() => scrollToSection('resume')} className="text-gray-300 hover:text-blue-400 transition">Resume</button>}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-3">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left text-gray-300 hover:text-blue-400">Home</button>
            {data.about.visible && <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-300 hover:text-blue-400">About</button>}
            <button onClick={() => scrollToSection('projects')} className="block w-full text-left text-gray-300 hover:text-blue-400">Projects</button>
            {data.settings.showResume && <button onClick={() => scrollToSection('resume')} className="block w-full text-left text-gray-300 hover:text-blue-400">Resume</button>}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const [displayedName, setDisplayedName] = useState('');
  const [showCursor, setShowCursor] = useState(true);

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
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [data.hero.name]);

  if (!data.hero.visible) return null;

  const scrollToNext = () => {
    const nextSection = data.about.visible ? 'about' : 'projects';
    document.getElementById(nextSection)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
      <FloatingIcon Icon={BarChart3} delay={0} position={{ top: '15%', left: '10%' }} />
      <FloatingIcon Icon={Database} delay={1} position={{ top: '25%', right: '15%' }} />
      <FloatingIcon Icon={TrendingUp} delay={2} position={{ bottom: '20%', left: '15%' }} />
      <FloatingIcon Icon={PieChart} delay={1.5} position={{ bottom: '25%', right: '10%' }} />
      <FloatingIcon Icon={LineChart} delay={0.5} position={{ top: '45%', left: '5%' }} />
      <FloatingIcon Icon={Activity} delay={2.5} position={{ top: '35%', right: '8%' }} />

      <div className={`text-center max-w-4xl z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gray-800 p-4 rounded-2xl border border-blue-500/30">
              <Database className="w-16 h-16 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-6 inline-block">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-gray-500 text-sm font-mono">terminal</span>
          </div>
          <div className="text-left font-mono">
            <span className="text-green-400 text-sm">$ </span>
            <span className="text-gray-400 text-sm">echo </span>
            <h1 className="inline text-4xl md:text-6xl font-bold text-blue-400">
              "{displayedName}"
              <span className={`inline-block w-1 h-10 md:h-14 bg-blue-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </h1>
          </div>
        </div>

        <p className="text-2xl md:text-3xl text-blue-400 mb-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            {data.hero.title.split('|')[0].trim()}
          </span>
          {data.hero.title.includes('|') && (
            <>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                {data.hero.title.split('|')[1]?.trim()}
              </span>
            </>
          )}
          {data.hero.title.split('|').length > 2 && (
            <>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-2">
                <Brain className="w-6 h-6" />
                {data.hero.title.split('|')[2]?.trim()}
              </span>
            </>
          )}
        </p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          {data.hero.description}
        </p>

        <button 
          onClick={scrollToNext}
          className="animate-bounce text-blue-400 hover:text-blue-300 transition"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

const About = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (!data.about.visible) return null;

  const skillIcons = {
    'Python': Code, 'R': Activity, 'SQL': Database, 'HTML': Code, 'JavaScript': Code, 'C': Code,
    'MongoDB': Database, 'Firebase': Database, 'MySQL': Database, 'Oracle': Database, 'PostgreSQL': Database, 
    'SQLite': Database, 'MySQL Workbench': Database, 'Tableau': PieChart, 'Power BI': BarChart3,
    'AWS Glue': TrendingUp, 'Microsoft Excel': LineChart, 'Salesforce': TrendingUp, 'JIRA': Target,
    'Spark': Zap, 'Hadoop': Zap, 'Power Apps': Activity, 'Power Automate': Activity, 'SharePoint': Database,
    'pandas': Activity, 'seaborn': LineChart, 'matplotlib': PieChart, 'scikit-learn': Brain,
    'scipy': Activity, 'TensorFlow': Brain, 'Keras': Brain, 'PyTorch': Brain, 'plotly': LineChart,
    'dash': BarChart3, 'geopandas': Activity, 'ArcGIS': Activity, 'Agile': Target, 'Scrum': Target,
    'Sprint Planning': Target, 'Stand-ups': Target, 'Retrospectives': Target
  };

  const categoryIcons = {
    'Languages': Code, 'Database': Database, 'Tools': Activity, 'Libraries': Brain,
    'Frameworks & Methodologies': Target, 'Big Data & Cloud': Zap
  };

  const skillCategories = data.about.skillCategories || [];
  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div id="about" className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <FloatingIcon Icon={Lightbulb} delay={0} position={{ top: '10%', right: '5%' }} />
      <FloatingIcon Icon={Target} delay={1.5} position={{ bottom: '15%', left: '8%' }} />

      <div className={`max-w-7xl transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <Brain className="w-10 h-10 text-blue-400" />
          <h2 className="text-4xl font-bold text-white text-center">About Me</h2>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            {data.about.content}
          </p>
        </div>

        <div className="mb-8 text-center">
          <p className="text-gray-400 text-sm">
            <span className="text-blue-400 font-semibold">{totalSkills}</span> technical skills across <span className="text-blue-400 font-semibold">{skillCategories.length}</span> categories
          </p>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, catIdx) => {
            const CategoryIcon = categoryIcons[category.category] || BarChart3;
            return (
              <div 
                key={catIdx}
                className={`transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${catIdx * 0.2}s` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CategoryIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">{category.category}</h3>
                  <span className="text-gray-500 text-sm ml-2">({category.skills.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {category.skills.map((skill, idx) => {
                    const Icon = skillIcons[skill] || BarChart3;
                    return (
                      <div 
                        key={idx} 
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-blue-500 transition-all duration-300 hover:scale-105 group"
                      >
                        <Icon className="w-5 h-5 text-blue-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-blue-400 text-xs">{skill}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);
  const visibleProjects = data.projects.filter(p => p.visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('projects');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getFileIcon = (fileName) => {
    const ext = fileName.toLowerCase().split('.').pop();
    switch(ext) {
      case 'pdf': return Download;
      case 'ipynb': return Code;
      case 'py': return Code;
      case 'csv': return Database;
      case 'xlsx':
      case 'xls': return LineChart;
      case 'pptx':
      case 'ppt': return PieChart;
      case 'docx':
      case 'doc': return Activity;
      default: return Download;
    }
  };

  const getFileColor = (fileName) => {
    const ext = fileName.toLowerCase().split('.').pop();
    switch(ext) {
      case 'pdf': return 'text-red-400';
      case 'ipynb': return 'text-orange-400';
      case 'py': return 'text-yellow-400';
      case 'csv': return 'text-green-400';
      case 'xlsx':
      case 'xls': return 'text-emerald-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div id="projects" className="relative min-h-screen px-4 py-20 overflow-hidden">
      <FloatingIcon Icon={Code} delay={0} position={{ top: '5%', left: '5%' }} />
      <FloatingIcon Icon={Zap} delay={2} position={{ top: '15%', right: '10%' }} />

      <div className="max-w-7xl mx-auto">
        <div className={`flex items-center justify-center gap-3 mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Laptop className="w-10 h-10 text-blue-400" />
          <h2 className="text-4xl font-bold text-white text-center">Projects</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, idx) => (
            <div 
              key={project.id} 
              className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              <LaptopFrame image={project.coverPhoto} title={project.title} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                  {project.title}
                </h3>
                {project.description && <p className="text-gray-400 mb-4 text-sm">{project.description}</p>}
                
                <div className="flex gap-3 mb-4">
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-transform"
                      title="View on GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.liveLink && (
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-transform"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {project.additionalFiles && project.additionalFiles.length > 0 && (
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 mb-2">Additional Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.additionalFiles.map((file, fileIdx) => {
                        const FileIcon = getFileIcon(file.name);
                        const colorClass = getFileColor(file.name);
                        return (
                          <a
                            key={fileIdx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 ${colorClass} hover:opacity-80 transition text-xs bg-gray-900 px-2 py-1 rounded border border-gray-700 hover:border-gray-600`}
                            title={file.name}
                          >
                            <FileIcon className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{file.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {visibleProjects.length === 0 && (
          <p className="text-center text-gray-500 text-lg">No projects yet. Add some from the admin panel!</p>
        )}
      </div>
    </div>
  );
};

const Resume = () => {
  const { data } = usePortfolio();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('resume');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (!data.settings.showResume) return null;
  
  const visibleResumes = data.resumes.filter(r => r.visible);

  const getGoogleDrivePreviewUrl = (fileId) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const getGoogleDriveDownloadUrl = (fileId) => {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  return (
    <div id="resume" className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className={`flex items-center justify-center gap-3 mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Download className="w-10 h-10 text-blue-400" />
          <h2 className="text-4xl font-bold text-white text-center">Resume</h2>
        </div>

        <div className="space-y-8">
          {visibleResumes.map((resume, idx) => (
            <div 
              key={resume.id} 
              className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 0.2}s` }}
            >
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  {resume.title}
                </h3>
                <a 
                  href={getGoogleDriveDownloadUrl(resume.driveFileId)} 
                  download
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
              <div className="aspect-[8.5/11] bg-gray-900 relative">
                <iframe
                  src={getGoogleDrivePreviewUrl(resume.driveFileId)}
                  className="w-full h-full"
                  title={resume.title}
                  sandbox="allow-same-origin allow-scripts"
                  style={{ pointerEvents: 'none' }}
                />
                <div 
                  className="absolute inset-0" 
                  style={{ pointerEvents: 'auto' }}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          ))}
          {visibleResumes.length === 0 && (
            <p className="text-center text-gray-500 text-lg">No resumes available. Add some from the admin panel!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const { data } = usePortfolio();
  const contact = data.contact || {};

  const contactItems = [
    { 
      key: 'personalEmail', 
      icon: Mail, 
      label: 'Personal Email', 
      value: contact.personalEmail?.value,
      visible: contact.personalEmail?.visible,
      href: contact.personalEmail?.value ? `mailto:${contact.personalEmail.value}` : null,
      color: 'text-blue-400 hover:text-blue-300'
    },
    { 
      key: 'orgEmail', 
      icon: Mail, 
      label: 'Organization Email', 
      value: contact.orgEmail?.value,
      visible: contact.orgEmail?.visible,
      href: contact.orgEmail?.value ? `mailto:${contact.orgEmail.value}` : null,
      color: 'text-purple-400 hover:text-purple-300'
    },
    { 
      key: 'phone', 
      icon: Phone, 
      label: 'Phone', 
      value: contact.phone?.value,
      visible: contact.phone?.visible,
      href: contact.phone?.value ? `tel:${contact.phone.value}` : null,
      color: 'text-green-400 hover:text-green-300'
    },
    { 
      key: 'linkedin', 
      icon: Linkedin, 
      label: 'LinkedIn', 
      value: contact.linkedin?.value,
      visible: contact.linkedin?.visible,
      href: contact.linkedin?.value,
      color: 'text-blue-500 hover:text-blue-400'
    },
    { 
      key: 'github', 
      icon: Github, 
      label: 'GitHub', 
      value: contact.github?.value,
      visible: contact.github?.visible,
      href: contact.github?.value,
      color: 'text-gray-400 hover:text-gray-300'
    },
    { 
      key: 'instagram', 
      icon: Instagram, 
      label: 'Instagram', 
      value: contact.instagram?.value,
      visible: contact.instagram?.visible,
      href: contact.instagram?.value,
      color: 'text-pink-400 hover:text-pink-300'
    },
    { 
      key: 'twitter', 
      icon: Twitter, 
      label: 'X', 
      value: contact.twitter?.value,
      visible: contact.twitter?.visible,
      href: contact.twitter?.value,
      color: 'text-sky-400 hover:text-sky-300'
    }
  ];

  const visibleContacts = contactItems.filter(item => item.visible && item.value);

  if (visibleContacts.length === 0) return null;

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Mail className="w-8 h-8 text-blue-400" />
          <h3 className="text-3xl font-bold text-white">Get In Touch</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {visibleContacts.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.key}
                href={item.href}
                target={item.href?.startsWith('http') ? '_blank' : undefined}
                rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`flex items-center gap-2 ${item.color} transition-all duration-300 hover:scale-110 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 hover:border-gray-700`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {data.hero?.name || 'Portfolio'}. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Password"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onClose }) => {
  const { data, updateSection, addProject, updateProject, deleteProject, addResume, updateResume, deleteResume } = usePortfolio();
  const [activeTab, setActiveTab] = useState('hero');
  const [newProject, setNewProject] = useState({
    title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: []
  });
  const [editingProject, setEditingProject] = useState(null);
  const [newResume, setNewResume] = useState({ title: '', driveFileId: '' });
  const [newFile, setNewFile] = useState({ name: '', url: '' });
  const [newSkillCategory, setNewSkillCategory] = useState({ category: '', skills: '' });
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);

  const handleSaveHero = (field, value) => {
    updateSection('hero', { [field]: value });
  };

  const handleSaveAbout = (field, value) => {
    updateSection('about', { [field]: value });
  };

  const handleAddProject = () => {
    if (newProject.title) {
      addProject(newProject);
      setNewProject({ title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: [] });
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description || '',
      coverPhoto: project.coverPhoto || '',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      additionalFiles: project.additionalFiles || []
    });
  };

  const handleUpdateProject = () => {
    if (editingProject && newProject.title) {
      updateProject(editingProject.id, newProject);
      setEditingProject(null);
      setNewProject({ title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: [] });
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setNewProject({ title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: [] });
  };

  const handleAddFile = () => {
    if (newFile.name && newFile.url) {
      setNewProject({
        ...newProject,
        additionalFiles: [...(newProject.additionalFiles || []), { ...newFile }]
      });
      setNewFile({ name: '', url: '' });
    }
  };

  const handleRemoveFile = (idx) => {
    setNewProject({
      ...newProject,
      additionalFiles: newProject.additionalFiles.filter((_, i) => i !== idx)
    });
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        alert('File size should be less than 1MB for best performance');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject({
          ...newProject,
          coverPhoto: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        alert('File size should be less than 1MB. For larger files, use Google Drive links.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFile({
          name: file.name,
          url: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkillCategory = () => {
    if (newSkillCategory.category && newSkillCategory.skills) {
      const skillsArray = newSkillCategory.skills.split(',').map(s => s.trim()).filter(s => s);
      const currentCategories = data.about.skillCategories || [];
      updateSection('about', {
        skillCategories: [...currentCategories, {
          category: newSkillCategory.category,
          skills: skillsArray
        }]
      });
      setNewSkillCategory({ category: '', skills: '' });
    }
  };

  const handleUpdateSkillCategory = (index, updatedCategory) => {
    const currentCategories = [...data.about.skillCategories];
    currentCategories[index] = updatedCategory;
    updateSection('about', { skillCategories: currentCategories });
  };

  const handleDeleteSkillCategory = (index) => {
    const currentCategories = data.about.skillCategories.filter((_, i) => i !== index);
    updateSection('about', { skillCategories: currentCategories });
  };

  const handleAddResume = () => {
    if (newResume.title && newResume.driveFileId) {
      addResume(newResume);
      setNewResume({ title: '', driveFileId: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={onClose} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
            <LogOut className="w-4 h-4" />
            Exit Admin
          </button>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {['hero', 'about', 'projects', 'resumes', 'contact', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'hero' && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={data.hero.name}
                onChange={(e) => handleSaveHero('name', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={data.hero.title}
                onChange={(e) => handleSaveHero('title', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Description</label>
              <textarea
                value={data.hero.description}
                onChange={(e) => handleSaveHero('description', e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.hero.visible}
                onChange={(e) => handleSaveHero('visible', e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-gray-400">Show Hero Section</label>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">About Content</label>
              <textarea
                value={data.about.content}
                onChange={(e) => handleSaveAbout('content', e.target.value)}
                rows={6}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-lg font-bold text-white mb-4">Skill Categories</h4>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-3">Add New Category</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Category Name (e.g., Data Science Tools)"
                    value={newSkillCategory.category}
                    onChange={(e) => setNewSkillCategory({...newSkillCategory, category: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Skills (comma separated, e.g., NumPy, Pandas, SciPy)"
                    value={newSkillCategory.skills}
                    onChange={(e) => setNewSkillCategory({...newSkillCategory, skills: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                  />
                  <button
                    onClick={handleAddSkillCategory}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(data.about.skillCategories || []).map((category, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-4">
                    {editingCategoryIndex === idx ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={category.category}
                          onChange={(e) => handleUpdateSkillCategory(idx, { ...category, category: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <input
                          type="text"
                          value={category.skills.join(', ')}
                          onChange={(e) => handleUpdateSkillCategory(idx, { 
                            ...category, 
                            skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={() => setEditingCategoryIndex(null)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-blue-400 font-semibold">{category.category}</h5>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingCategoryIndex(idx)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkillCategory(idx)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, skillIdx) => (
                            <span key={skillIdx} className="bg-gray-800 text-blue-300 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.about.visible}
                onChange={(e) => handleSaveAbout('visible', e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-gray-400">Show About Section</label>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title *"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <textarea
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Cover Photo URL"
                  value={newProject.coverPhoto}
                  onChange={(e) => setNewProject({...newProject, coverPhoto: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">OR</span>
                  <label className="flex-1 cursor-pointer">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-center hover:border-blue-500 transition">
                      <span className="text-blue-400 text-sm">📁 Upload from Device (Max 1MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverPhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                {newProject.coverPhoto && (
                  <div className="bg-gray-900 rounded-lg p-2">
                    <img 
                      src={newProject.coverPhoto} 
                      alt="Cover preview" 
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="GitHub Link"
                  value={newProject.githubLink}
                  onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Live/Demo Link"
                  value={newProject.liveLink}
                  onChange={(e) => setNewProject({...newProject, liveLink: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                
                <div className="border-t border-gray-700 pt-4">
                  <label className="block text-gray-400 mb-2 font-semibold">Additional Files</label>
                  <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="File Name"
                          value={newFile.name}
                          onChange={(e) => setNewFile({...newFile, name: e.target.value})}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="File URL"
                          value={newFile.url}
                          onChange={(e) => setNewFile({...newFile, url: e.target.value})}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={handleAddFile}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm whitespace-nowrap"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 border-t border-gray-700"></div>
                        <span className="text-gray-500 text-xs">OR</span>
                        <div className="flex-1 border-t border-gray-700"></div>
                      </div>
                      
                      <label className="block cursor-pointer">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-center hover:border-blue-500 transition">
                          <span className="text-blue-400 text-sm">📎 Upload File (Max 1MB)</span>
                          <input
                            type="file"
                            accept=".pdf,.ipynb,.py,.csv,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.json"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      </label>
                    </div>
                    
                    {newProject.additionalFiles && newProject.additionalFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Files:</p>
                        {newProject.additionalFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Download className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              <span className="text-white text-sm truncate">{file.name}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="text-red-400 hover:text-red-300 flex-shrink-0 ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {editingProject ? (
                    <>
                      <button
                        onClick={handleUpdateProject}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        <Save className="w-4 h-4" />
                        Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddProject}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Existing Projects</h3>
              {data.projects.map(project => (
                <div key={project.id} className="bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-white">{project.title}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateProject(project.id, { visible: !project.visible })}
                        className="text-gray-400 hover:text-white"
                        title="Toggle Visibility"
                      >
                        {project.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{project.description || 'No description'}</p>
                  <div className="flex gap-4 text-xs text-gray-500 mb-2">
                    {project.githubLink && <span>GitHub ✓</span>}
                    {project.liveLink && <span>Live ✓</span>}
                    {project.coverPhoto && <span>Cover ✓</span>}
                  </div>
                  {project.additionalFiles && project.additionalFiles.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Files: {project.additionalFiles.length}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.additionalFiles.map((file, idx) => (
                          <span key={idx} className="text-blue-400 text-xs bg-gray-900 px-2 py-1 rounded">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resumes' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Add New Resume</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Resume Title *"
                  value={newResume.title}
                  onChange={(e) => setNewResume({...newResume, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Google Drive File ID *"
                  value={newResume.driveFileId}
                  onChange={(e) => setNewResume({...newResume, driveFileId: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-400">
                  <p className="mb-2 font-semibold text-blue-400">📋 How to get Google Drive File ID:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Upload your resume to Google Drive</li>
                    <li>Right-click → Share → Change to Anyone with the link</li>
                    <li>Copy the link</li>
                    <li>Extract FILE_ID from URL</li>
                    <li>Paste only the FILE_ID above</li>
                  </ol>
                </div>
                <button
                  onClick={handleAddResume}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Resume
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Existing Resumes</h3>
              {data.resumes.map(resume => (
                <div key={resume.id} className="bg-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{resume.title}</h4>
                      <p className="text-gray-400 text-sm font-mono">{resume.driveFileId}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateResume(resume.id, { visible: !resume.visible })}
                        className="text-gray-400 hover:text-white"
                      >
                        {resume.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteResume(resume.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
            
            {[
              { key: 'personalEmail', icon: Mail, label: 'Personal Email', type: 'email', placeholder: 'your@email.com' },
              { key: 'orgEmail', icon: Mail, label: 'Organization Email', type: 'email', placeholder: 'your@company.com' },
              { key: 'phone', icon: Phone, label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 123-4567' },
              { key: 'linkedin', icon: Linkedin, label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
              { key: 'github', icon: Github, label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
              { key: 'instagram', icon: Instagram, label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
              { key: 'twitter', icon: Twitter, label: 'X (Twitter) URL', type: 'url', placeholder: 'https://x.com/...' }
            ].map(({ key, icon: Icon, label, type, placeholder }) => (
              <div key={key} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 font-semibold flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.contact[key]?.visible ?? true}
                      onChange={(e) => updateSection('contact', { 
                        [key]: { ...data.contact[key], visible: e.target.checked } 
                      })}
                      className="w-4 h-4"
                    />
                    <Eye className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <input
                  type={type}
                  value={data.contact[key]?.value ?? ''}
                  onChange={(e) => updateSection('contact', { 
                    [key]: { ...data.contact[key], value: e.target.value } 
                  })}
                  placeholder={placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.settings.showResume}
                onChange={(e) => updateSection('settings', { showResume: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="text-gray-400">Show Resume Page</label>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm mb-2">💡 Login credentials are managed through Firebase Authentication</p>
              <p className="text-gray-500 text-xs">To change admin email/password, go to Firebase Console → Authentication → Users</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname;
      if (path === '/secret-admin-portal') {
        setIsAdminMode(true);
      }
    };
    
    checkAdminPath();
    
    const handlePopState = () => {
      checkAdminPath();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setCheckingAuth(false);
    });
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setIsAdminMode(false);
      window.history.pushState({}, '', '/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isAdminMode) {
    return (
      <PortfolioProvider>
        {!isAuthenticated ? (
          <AdminLogin onLogin={handleLogin} />
        ) : (
          <AdminDashboard onClose={handleLogout} />
        )}
      </PortfolioProvider>
    );
  }

  return (
    <PortfolioProvider>
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Footer />
      </div>
    </PortfolioProvider>
  );
};

export default App;