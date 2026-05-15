import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Pages
import HomePage from './components/pages/HomePage';
import WhyHireMePage from './components/pages/WhyHireMePage';
import ProjectDetailPage from './components/pages/ProjectDetailPage';
import AdminPage from './components/pages/AdminPage';

// Context
export const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};

const initialData = {
  hero: {
    name: "Nirmit Sachde",
    title: "Data Analyst | Business Analyst | Data Scientist",
    description: "Recent graduate passionate about turning data into actionable insights. Experienced in data analysis, visualization and machine learning.",
    visible: true
  },
  about: {
    content: "Every project I build starts the same way: someone is struggling with data. A partner who cannot navigate clinicaltrials.gov. A Reddit user with a hand-colored Excel table full of errors. A friend in healthcare frustrated with buried complaint data. I figure out how to make it readable.",
    skillCategories: [
      { category: "Languages", skills: ["Python", "R", "SQL", "JavaScript", "HTML/CSS"] },
      { category: "Database", skills: ["MongoDB", "Firebase", "MySQL", "Oracle", "PostgreSQL", "SQLite"] },
      { category: "Tools", skills: ["Tableau", "Power BI", "AWS Glue", "Microsoft Excel", "Salesforce", "JIRA", "Power Apps"] },
      { category: "Libraries", skills: ["pandas", "seaborn", "matplotlib", "scikit-learn", "TensorFlow", "Keras", "PyTorch", "plotly", "dash", "geopandas"] },
      { category: "Frameworks & Methodologies", skills: ["Agile", "Scrum", "Sprint Planning", "Retrospectives"] },
      { category: "Big Data & Cloud", skills: ["AWS Glue", "Spark", "Hadoop", "Databricks", "Delta Lake"] }
    ],
    visible: true
  },
  projects: [],
  resumes: [],
  contact: {
    personalEmail: { value: "sachde.n@northeastern.edu", visible: true },
    orgEmail: { value: "", visible: false },
    phone: { value: "", visible: false },
    linkedin: { value: "https://www.linkedin.com/in/nirmit-a-sachde/", visible: true },
    github: { value: "https://github.com/NirmitSachde", visible: true },
    instagram: { value: "", visible: false },
    twitter: { value: "", visible: false }
  },
  settings: { showResume: true }
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
    }
  };

  const updateSection = (section, newData) => {
    const updatedData = { ...data, [section]: { ...data[section], ...newData } };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const addProject = (project) => {
    const updatedData = { ...data, projects: [...data.projects, { ...project, id: Date.now(), visible: true }] };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const updateProject = (id, updates) => {
    const updatedData = { ...data, projects: data.projects.map(p => p.id === id ? { ...p, ...updates } : p) };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const deleteProject = (id) => {
    const updatedData = { ...data, projects: data.projects.filter(p => p.id !== id) };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const addResume = (resume) => {
    const updatedData = { ...data, resumes: [...data.resumes, { ...resume, id: Date.now(), visible: true }] };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const updateResume = (id, updates) => {
    const updatedData = { ...data, resumes: data.resumes.map(r => r.id === id ? { ...r, ...updates } : r) };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const deleteResume = (id) => {
    const updatedData = { ...data, resumes: data.resumes.filter(r => r.id !== id) };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
        <div className="text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <PortfolioContext.Provider value={{
      data, setData, saveToFirebase, updateSection,
      addProject, updateProject, deleteProject,
      addResume, updateResume, deleteResume
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => {
  return (
    <PortfolioProvider>
      <div className="noise">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/why-hire-me" element={<WhyHireMePage />} />
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
          <Route path="/secret-admin-portal" element={<AdminPage />} />
        </Routes>
      </div>
    </PortfolioProvider>
  );
};

export default App;
