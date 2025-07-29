import React, { useState } from 'react';
import { 
  FaUser, 
  FaEdit, 
  FaSave,
  FaPlus,
  FaTrash,
  FaUpload,
  FaEye,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
  FaCode
} from 'react-icons/fa';

const ProfileManagement = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileData, setProfileData] = useState({
    // Basic Information
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: 'San Francisco, CA',
    title: 'Frontend Developer',
    summary: 'Passionate frontend developer with 3+ years of experience building responsive web applications using React, JavaScript, and modern CSS frameworks.',
    
    // Social Links
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
    
    // Experience
    experience: [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: 'Present',
        current: true,
        description: 'Developed and maintained responsive web applications using React, TypeScript, and Tailwind CSS. Collaborated with design and backend teams to deliver high-quality user experiences.'
      },
      {
        id: 2,
        title: 'Junior Developer',
        company: 'StartupXYZ',
        location: 'San Jose, CA',
        startDate: '2021-06',
        endDate: '2021-12',
        current: false,
        description: 'Built interactive user interfaces and implemented RESTful API integrations. Participated in code reviews and agile development processes.'
      }
    ],
    
    // Education
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2017-09',
        endDate: '2021-05',
        gpa: '3.8'
      }
    ],
    
    // Skills
    skills: [
      { id: 1, name: 'React', level: 'Expert' },
      { id: 2, name: 'JavaScript', level: 'Expert' },
      { id: 3, name: 'TypeScript', level: 'Advanced' },
      { id: 4, name: 'CSS/SCSS', level: 'Advanced' },
      { id: 5, name: 'Node.js', level: 'Intermediate' },
      { id: 6, name: 'Python', level: 'Intermediate' }
    ],
    
    // Certifications
    certifications: [
      {
        id: 1,
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-03',
        credentialId: 'AWS-12345'
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (arrayName, newItem) => {
    setProfileData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...newItem, id: Date.now() }]
    }));
  };

  const handleArrayUpdate = (arrayName, id, updatedItem) => {
    setProfileData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    }));
  };

  const handleArrayDelete = (arrayName, id) => {
    setProfileData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter(item => item.id !== id)
    }));
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 8;
    
    if (profileData.name) completed++;
    if (profileData.email) completed++;
    if (profileData.phone) completed++;
    if (profileData.summary) completed++;
    if (profileData.experience.length > 0) completed++;
    if (profileData.education.length > 0) completed++;
    if (profileData.skills.length > 0) completed++;
    if (profileData.linkedin || profileData.github || profileData.portfolio) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const BasicInfoTab = () => (
    <div className="tab-content">
      <div className="profile-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group full-width">
            <label>Professional Title</label>
            <input
              type="text"
              value={profileData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group full-width">
            <label>Professional Summary</label>
            <textarea
              value={profileData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Social Links</h3>
        <div className="form-grid">
          <div className="form-group">
            <label><FaLinkedin /> LinkedIn</label>
            <input
              type="url"
              value={profileData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label><FaGithub /> GitHub</label>
            <input
              type="url"
              value={profileData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label><FaGlobe /> Portfolio</label>
            <input
              type="url"
              value={profileData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ExperienceTab = () => (
    <div className="tab-content">
      <div className="profile-section">
        <div className="section-header">
          <h3>Work Experience</h3>
          {isEditing && (
            <button 
              className="add-btn"
              onClick={() => handleArrayAdd('experience', {
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
              })}
            >
              <FaPlus /> Add Experience
            </button>
          )}
        </div>
        
        <div className="experience-list">
          {profileData.experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              {isEditing ? (
                <div className="experience-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { company: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { location: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleArrayUpdate('experience', exp.id, { 
                            current: e.target.checked,
                            endDate: e.target.checked ? 'Present' : ''
                          })}
                        />
                        Current Position
                      </label>
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleArrayDelete('experience', exp.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="experience-display">
                  <div className="experience-header">
                    <h4>{exp.title}</h4>
                    <span className="company">{exp.company}</span>
                    <span className="location">{exp.location}</span>
                    <span className="duration">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                      {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="experience-description">{exp.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SkillsTab = () => (
    <div className="tab-content">
      <div className="profile-section">
        <div className="section-header">
          <h3>Skills & Expertise</h3>
          {isEditing && (
            <button 
              className="add-btn"
              onClick={() => handleArrayAdd('skills', { name: '', level: 'Beginner' })}
            >
              <FaPlus /> Add Skill
            </button>
          )}
        </div>
        
        <div className="skills-grid">
          {profileData.skills.map((skill) => (
            <div key={skill.id} className="skill-item">
              {isEditing ? (
                <div className="skill-form">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleArrayUpdate('skills', skill.id, { name: e.target.value })}
                    placeholder="Skill name"
                  />
                  <select
                    value={skill.level}
                    onChange={(e) => handleArrayUpdate('skills', skill.id, { level: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button 
                    className="delete-btn small"
                    onClick={() => handleArrayDelete('skills', skill.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="skill-display">
                  <span className="skill-name">{skill.name}</span>
                  <span className={`skill-level ${skill.level.toLowerCase()}`}>{skill.level}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-management-section">
      <div className="profile-header">
        <div className="header-content">
          <h2>Profile Management</h2>
          <p>Keep your profile up to date to attract the right opportunities</p>
        </div>
        <div className="header-actions">
          <div className="profile-completion">
            <div className="completion-circle">
              <span>{calculateProfileCompletion()}%</span>
            </div>
            <span>Profile Complete</span>
          </div>
          <button 
            className={`edit-btn ${isEditing ? 'save' : 'edit'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <FaUser /> Basic Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          <FaBriefcase /> Experience
        </button>
        <button 
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <FaCode /> Skills
        </button>
        <button 
          className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          <FaGraduationCap /> Education
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'basic' && <BasicInfoTab />}
        {activeTab === 'experience' && <ExperienceTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'education' && (
          <div className="tab-content">
            <div className="profile-section">
              <h3>Education & Certifications</h3>
              <p>Education and certification management coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;
