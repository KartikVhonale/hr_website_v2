import React, { useState, useEffect } from 'react';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye,
  FaEdit,
  FaPlus,
  FaSave,
  FaTrash,
  FaPrint,
  FaUpload
} from 'react-icons/fa';
import '../../css/ResumeBuilder.css';

const ResumeBuilder = ({ user }) => {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional design' },
    { id: 'classic', name: 'Classic', description: 'Traditional resume format' },
    { id: 'creative', name: 'Creative', description: 'Stand out with unique design' }
  ];

  useEffect(() => {
    // In a real implementation, you would fetch resume data from the backend
    // For now, we'll use mock data
    setResumeData({
      personalInfo: {
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        phone: user?.phone || '(555) 123-4567',
        location: user?.location || 'San Francisco, CA',
        linkedin: user?.linkedin || 'linkedin.com/in/johndoe',
        github: user?.github || 'github.com/johndoe'
      },
      summary: user?.summary || 'Experienced frontend developer with a passion for creating intuitive user interfaces and solving complex problems.',
      experience: user?.experience || [
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'Present',
          description: 'Developed responsive web applications using React and modern JavaScript frameworks.'
        }
      ],
      education: user?.education || [
        {
          id: 1,
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          startDate: '2017-09',
          endDate: '2021-05'
        }
      ],
      skills: user?.skills || ['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'Python']
    });
  }, [user]);

  const handleSaveResume = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would call an API to save the resume data
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Resume saved successfully!');
    } catch (err) {
      console.error('Failed to save resume:', err);
      alert('Failed to save resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would call an API to generate and download the PDF
      // For now, we'll just simulate the download
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Resume PDF downloaded successfully!');
    } catch (err) {
      console.error('Failed to download resume:', err);
      alert('Failed to download resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  const handleUploadResume = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you would upload the file to the backend
      alert(`Uploaded file: ${file.name}`);
    }
  };

  return (
    <div className="resume-builder-section">
      <div className="resume-header">
        <div className="header-content">
          <h2>Resume Builder</h2>
          <p>Create a professional resume that stands out</p>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn save-btn" 
            onClick={handleSaveResume}
            disabled={loading}
          >
            <FaSave /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="action-btn preview-btn" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <FaEye /> {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          <button 
            className="action-btn download-btn"
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            <FaDownload /> {loading ? 'Generating...' : 'Download PDF'}
          </button>
          <button 
            className="action-btn print-btn"
            onClick={handlePrintResume}
          >
            <FaPrint /> Print
          </button>
          <label className="action-btn upload-btn">
            <FaUpload /> Upload
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleUploadResume}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="resume-content">
        <div className="template-selector">
          <h3>Choose Template</h3>
          <div className="templates-grid">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className={`template-card ${activeTemplate === template.id ? 'active' : ''}`}
                onClick={() => setActiveTemplate(template.id)}
              >
                <div className="template-preview">
                  <div className="template-thumbnail"></div>
                </div>
                <div className="template-info">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-editor">
          <div className="editor-placeholder">
            <FaFileAlt className="placeholder-icon" />
            <h3>Resume Builder Coming Soon</h3>
            <p>We're working on an advanced resume builder with multiple templates, real-time preview, and PDF export.</p>
            <div className="features-list">
              <div className="feature-item">✓ Multiple professional templates</div>
              <div className="feature-item">✓ Real-time preview</div>
              <div className="feature-item">✓ PDF export</div>
              <div className="feature-item">✓ ATS-friendly formats</div>
              <div className="feature-item">✓ Auto-save functionality</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
