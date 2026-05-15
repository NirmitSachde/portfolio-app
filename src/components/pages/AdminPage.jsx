import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  LogOut, Plus, Save, Trash2, Eye, EyeOff, Menu, X,
  Download, Mail, Phone, Linkedin, Github, Instagram, Twitter
} from 'lucide-react';
import { usePortfolio } from '../../App';

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-deep)' }}>
      <div className="rounded-xl p-8 max-w-md w-full" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Admin Login</h2>
        <div className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email"
            className="w-full rounded-lg px-4 py-3 focus:outline-none"
            style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} placeholder="Password"
            className="w-full rounded-lg px-4 py-3 focus:outline-none"
            style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          {error && <p style={{ color: 'var(--red)', fontSize: '14px' }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-lg transition disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onClose }) => {
  const { data, setData, saveToFirebase, updateSection, addProject, updateProject, deleteProject, addResume, updateResume, deleteResume } = usePortfolio();
  const [activeTab, setActiveTab] = useState('hero');
  const [newProject, setNewProject] = useState({
    title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '',
    additionalFiles: [], inspiration: '', whatWasDone: '', skills: ''
  });
  const [editingProject, setEditingProject] = useState(null);
  const [newResume, setNewResume] = useState({ title: '', driveFileId: '' });
  const [newFile, setNewFile] = useState({ name: '', url: '' });
  const [newSkillCategory, setNewSkillCategory] = useState({ category: '', skills: '' });
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);

  const handleSaveHero = (field, value) => updateSection('hero', { [field]: value });
  const handleSaveAbout = (field, value) => updateSection('about', { [field]: value });

  const handleAddProject = () => {
    if (newProject.title) {
      const projectData = {
        ...newProject,
        skills: newProject.skills ? newProject.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        whatWasDone: newProject.whatWasDone ? newProject.whatWasDone.split('\n').map(s => s.trim()).filter(s => s) : [],
      };
      addProject(projectData);
      setNewProject({ title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: [], inspiration: '', whatWasDone: '', skills: '' });
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
      additionalFiles: project.additionalFiles || [],
      inspiration: project.inspiration || '',
      whatWasDone: Array.isArray(project.whatWasDone) ? project.whatWasDone.join('\n') : (project.whatWasDone || ''),
      skills: Array.isArray(project.skills) ? project.skills.join(', ') : (project.skills || ''),
    });
  };

  const handleUpdateProject = () => {
    if (editingProject && newProject.title) {
      const projectData = {
        ...newProject,
        skills: typeof newProject.skills === 'string' ? newProject.skills.split(',').map(s => s.trim()).filter(s => s) : newProject.skills,
        whatWasDone: typeof newProject.whatWasDone === 'string' ? newProject.whatWasDone.split('\n').map(s => s.trim()).filter(s => s) : newProject.whatWasDone,
      };
      updateProject(editingProject.id, projectData);
      setEditingProject(null);
      setNewProject({ title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: [], inspiration: '', whatWasDone: '', skills: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setNewProject({ title: '', description: '', coverPhoto: '', githubLink: '', liveLink: '', additionalFiles: [], inspiration: '', whatWasDone: '', skills: '' });
  };

  const handleAddFile = () => {
    if (newFile.name && newFile.url) {
      setNewProject({ ...newProject, additionalFiles: [...(newProject.additionalFiles || []), { ...newFile }] });
      setNewFile({ name: '', url: '' });
    }
  };

  const handleRemoveFile = (idx) => {
    setNewProject({ ...newProject, additionalFiles: newProject.additionalFiles.filter((_, i) => i !== idx) });
  };

  const handleAddSkillCategory = () => {
    if (newSkillCategory.category && newSkillCategory.skills) {
      const skillsArray = newSkillCategory.skills.split(',').map(s => s.trim()).filter(s => s);
      const currentCategories = data.about.skillCategories || [];
      updateSection('about', { skillCategories: [...currentCategories, { category: newSkillCategory.category, skills: skillsArray }] });
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(data.projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedData = { ...data, projects: items };
    setData(updatedData);
    saveToFirebase(updatedData);
  };

  const inputStyle = { background: 'var(--bg-deep)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
  const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' };

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
            style={{ background: 'var(--red)', color: '#fff', fontSize: '14px' }}>
            <LogOut className="w-4 h-4" /> Exit
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['hero', 'about', 'projects', 'resumes', 'contact', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg font-medium transition whitespace-nowrap"
              style={{
                background: activeTab === tab ? 'var(--accent)' : 'var(--bg-surface)',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${activeTab === tab ? 'var(--accent)' : 'var(--border)'}`,
                fontFamily: 'var(--font-body)', fontSize: '13px',
              }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="rounded-xl p-6 space-y-4" style={cardStyle}>
            <div>
              <label className="block mb-2" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Name</label>
              <input type="text" value={data.hero.name} onChange={(e) => handleSaveHero('name', e.target.value)}
                className="w-full rounded-lg px-4 py-2" style={inputStyle} />
            </div>
            <div>
              <label className="block mb-2" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Title (separate roles with |)</label>
              <input type="text" value={data.hero.title} onChange={(e) => handleSaveHero('title', e.target.value)}
                className="w-full rounded-lg px-4 py-2" style={inputStyle} />
            </div>
            <div>
              <label className="block mb-2" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Description</label>
              <textarea value={data.hero.description} onChange={(e) => handleSaveHero('description', e.target.value)}
                rows={4} className="w-full rounded-lg px-4 py-2" style={inputStyle} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={data.hero.visible} onChange={(e) => handleSaveHero('visible', e.target.checked)} className="w-5 h-5" />
              <label style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Show Hero Section</label>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="rounded-xl p-6 space-y-4" style={cardStyle}>
            <div>
              <label className="block mb-2" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>About Content</label>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>Use blank lines between paragraphs.</p>
              <textarea value={data.about.content} onChange={(e) => handleSaveAbout('content', e.target.value)}
                rows={6} className="w-full rounded-lg px-4 py-2" style={inputStyle} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Skill Categories</h4>

              <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--bg-deep)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Add New Category</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Category Name" value={newSkillCategory.category}
                    onChange={(e) => setNewSkillCategory({ ...newSkillCategory, category: e.target.value })}
                    className="w-full rounded-lg px-4 py-2 text-sm" style={inputStyle} />
                  <input type="text" placeholder="Skills (comma separated)" value={newSkillCategory.skills}
                    onChange={(e) => setNewSkillCategory({ ...newSkillCategory, skills: e.target.value })}
                    className="w-full rounded-lg px-4 py-2 text-sm" style={inputStyle} />
                  <button onClick={handleAddSkillCategory}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm"
                    style={{ background: 'var(--accent)', color: '#fff' }}>
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(data.about.skillCategories || []).map((category, idx) => (
                  <div key={idx} className="rounded-lg p-4" style={{ background: 'var(--bg-deep)' }}>
                    {editingCategoryIndex === idx ? (
                      <div className="space-y-3">
                        <input type="text" value={category.category}
                          onChange={(e) => handleUpdateSkillCategory(idx, { ...category, category: e.target.value })}
                          className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle} />
                        <input type="text" value={category.skills.join(', ')}
                          onChange={(e) => handleUpdateSkillCategory(idx, { ...category, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                          className="w-full rounded-lg px-3 py-2 text-sm" style={inputStyle} />
                        <button onClick={() => setEditingCategoryIndex(null)}
                          className="px-3 py-1 rounded text-sm" style={{ background: 'var(--green)', color: '#fff' }}>Done</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h5 style={{ color: 'var(--accent-bright)', fontWeight: 600, fontSize: '14px' }}>{category.category}</h5>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingCategoryIndex(idx)} style={{ color: 'var(--accent)' }}><Save className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteSkillCategory(idx)} style={{ color: 'var(--red)' }}><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, si) => (
                            <span key={si} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-surface)', color: 'var(--accent-bright)' }}>{skill}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" checked={data.about.visible} onChange={(e) => handleSaveAbout('visible', e.target.checked)} className="w-5 h-5" />
              <label style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Show About and Skills Sections</label>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <div className="space-y-4">
                <input type="text" placeholder="Project Title *" value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <textarea placeholder="Description" value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3} className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <textarea placeholder="Why I built this (inspiration/story)" value={newProject.inspiration}
                  onChange={(e) => setNewProject({ ...newProject, inspiration: e.target.value })}
                  rows={2} className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <textarea placeholder="What was done (one item per line)" value={newProject.whatWasDone}
                  onChange={(e) => setNewProject({ ...newProject, whatWasDone: e.target.value })}
                  rows={3} className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <input type="text" placeholder="Skills (comma separated: Python, Plotly, SQL)" value={newProject.skills}
                  onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <input type="text" placeholder="Cover Photo URL (use Imgur)" value={newProject.coverPhoto}
                  onChange={(e) => setNewProject({ ...newProject, coverPhoto: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                {newProject.coverPhoto && (
                  <div className="rounded-lg p-2" style={{ background: 'var(--bg-deep)' }}>
                    <img src={newProject.coverPhoto} alt="Cover preview" className="w-full h-32 object-contain rounded" style={{ background: '#000' }} />
                  </div>
                )}
                <input type="text" placeholder="GitHub Link" value={newProject.githubLink}
                  onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <input type="text" placeholder="Live/Demo Link" value={newProject.liveLink}
                  onChange={(e) => setNewProject({ ...newProject, liveLink: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />

                {/* Additional files */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <label style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '8px' }}>Additional Files</label>
                  <div className="rounded-lg p-4 space-y-3" style={{ background: 'var(--bg-deep)' }}>
                    <div className="flex gap-2">
                      <input type="text" placeholder="File Name" value={newFile.name}
                        onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                        className="flex-1 rounded-lg px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" placeholder="File URL" value={newFile.url}
                        onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                        className="flex-1 rounded-lg px-3 py-2 text-sm" style={inputStyle} />
                      <button onClick={handleAddFile} className="px-3 py-2 rounded-lg transition text-sm whitespace-nowrap"
                        style={{ background: 'var(--accent)', color: '#fff' }}>Add</button>
                    </div>
                    {newProject.additionalFiles && newProject.additionalFiles.length > 0 && (
                      <div className="space-y-2">
                        {newProject.additionalFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded px-3 py-2" style={{ background: 'var(--bg-surface)' }}>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Download className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                              <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                            </div>
                            <button onClick={() => handleRemoveFile(idx)} style={{ color: 'var(--red)' }}><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {editingProject ? (
                    <>
                      <button onClick={handleUpdateProject} className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                        style={{ background: 'var(--green)', color: '#fff' }}><Save className="w-4 h-4" /> Update</button>
                      <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={handleAddProject} className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                      style={{ background: 'var(--accent)', color: '#fff' }}><Plus className="w-4 h-4" /> Add Project</button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Existing Projects (Drag to Reorder)</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projects">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {data.projects.map((project, index) => (
                        <Draggable key={project.id.toString()} draggableId={project.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps}
                              className="rounded-xl p-6 transition-all"
                              style={{ ...cardStyle, ...(snapshot.isDragging ? { boxShadow: '0 0 20px rgba(59,130,246,0.3)' } : {}) }}>
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                    <Menu className="w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                                  </div>
                                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{project.title}</h4>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditProject(project)} style={{ color: 'var(--accent)' }}><Save className="w-5 h-5" /></button>
                                  <button onClick={() => updateProject(project.id, { visible: !project.visible })} style={{ color: 'var(--text-muted)' }}>
                                    {project.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                  </button>
                                  <button onClick={() => deleteProject(project.id)} style={{ color: 'var(--red)' }}><Trash2 className="w-5 h-5" /></button>
                                </div>
                              </div>
                              <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{project.description || 'No description'}</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2" style={{ color: 'var(--text-dim)' }}>
                                {project.githubLink && <span>GitHub</span>}
                                {project.liveLink && <span>Live</span>}
                                {project.coverPhoto && <span>Cover</span>}
                                {project.inspiration && <span>Story</span>}
                              </div>
                              {project.skills && project.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {project.skills.slice(0, 5).map((s, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-deep)', color: 'var(--accent)', border: '1px solid var(--border)' }}>{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        )}

        {/* RESUMES TAB */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Add New Resume</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Resume Title *" value={newResume.title}
                  onChange={(e) => setNewResume({ ...newResume, title: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <input type="text" placeholder="Google Drive File ID *" value={newResume.driveFileId}
                  onChange={(e) => setNewResume({ ...newResume, driveFileId: e.target.value })}
                  className="w-full rounded-lg px-4 py-2" style={inputStyle} />
                <div className="rounded-lg p-4 text-sm" style={{ background: 'var(--bg-deep)', color: 'var(--text-muted)' }}>
                  <p className="mb-2 font-semibold" style={{ color: 'var(--accent-bright)' }}>How to get Google Drive File ID:</p>
                  <p>1. Upload resume to Google Drive</p>
                  <p>2. Right-click, Share, Anyone with the link</p>
                  <p>3. Copy the link, extract FILE_ID from URL</p>
                </div>
                <button onClick={handleAddResume} className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                  style={{ background: 'var(--accent)', color: '#fff' }}><Plus className="w-4 h-4" /> Add Resume</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Existing Resumes</h3>
              {data.resumes.map(resume => (
                <div key={resume.id} className="rounded-xl p-6" style={cardStyle}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{resume.title}</h4>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{resume.driveFileId}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateResume(resume.id, { visible: !resume.visible })} style={{ color: 'var(--text-muted)' }}>
                        {resume.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <button onClick={() => deleteResume(resume.id)} style={{ color: 'var(--red)' }}><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="rounded-xl p-6 space-y-6" style={cardStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Contact Information</h3>
            {[
              { key: 'personalEmail', icon: Mail, label: 'Personal Email', type: 'email', placeholder: 'your@email.com' },
              { key: 'orgEmail', icon: Mail, label: 'Organization Email', type: 'email', placeholder: 'your@company.com' },
              { key: 'phone', icon: Phone, label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 123-4567' },
              { key: 'linkedin', icon: Linkedin, label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
              { key: 'github', icon: Github, label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
              { key: 'instagram', icon: Instagram, label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
              { key: 'twitter', icon: Twitter, label: 'X (Twitter) URL', type: 'url', placeholder: 'https://x.com/...' }
            ].map(({ key, icon: Icon, label, type, placeholder }) => (
              <div key={key} className="rounded-lg p-4" style={{ background: 'var(--bg-deep)' }}>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    <Icon className="w-4 h-4" /> {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={data.contact[key]?.visible ?? true}
                      onChange={(e) => updateSection('contact', { [key]: { ...data.contact[key], visible: e.target.checked } })}
                      className="w-4 h-4" />
                    <Eye className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                  </div>
                </div>
                <input type={type} value={data.contact[key]?.value ?? ''}
                  onChange={(e) => updateSection('contact', { [key]: { ...data.contact[key], value: e.target.value } })}
                  placeholder={placeholder} className="w-full rounded-lg px-4 py-2 text-sm" style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="rounded-xl p-6 space-y-4" style={cardStyle}>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={data.settings.showResume}
                onChange={(e) => updateSection('settings', { showResume: e.target.checked })} className="w-5 h-5" />
              <label style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Show Resume Page</label>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Login credentials are managed through Firebase Authentication</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '12px' }}>To change admin email/password, go to Firebase Console, Authentication, Users</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    navigate('/');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
        <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onClose={handleLogout} />;
};

export default AdminPage;
