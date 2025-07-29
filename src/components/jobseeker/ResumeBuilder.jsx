import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye,
  FaEdit,
  FaPlus,
  FaSave,
  FaTrash,
  FaPrint
} from 'react-icons/fa';

const ResumeBuilder = ({ user }) => {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional design' },
    { id: 'classic', name: 'Classic', description: 'Traditional resume format' },
    { id: 'creative', name: 'Creative', description: 'Stand out with unique design' }
  ];

  return (
    <div className="resume-builder-section">
      <div className="resume-header">
        <div className="header-content">
          <h2>Resume Builder</h2>
          <p>Create a professional resume that stands out</p>
        </div>
        <div className="header-actions">
          <button className="action-btn preview-btn" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <FaEye /> {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          <button className="action-btn download-btn">
            <FaDownload /> Download PDF
          </button>
          <button className="action-btn print-btn">
            <FaPrint /> Print
          </button>
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
