import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EducationTab = ({ 
  getProfileArray, 
  handleArrayAdd, 
  handleArrayUpdate, 
  handleArrayDelete, 
  isEditing, 
  loading 
}) => {
  return (
    <div className="tab-content">
      {/* Education Section */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Education</h3>
          {isEditing && (
            <button
              type="button"
              className="add-btn"
              onClick={() => handleArrayAdd('education', {
                degree: '',
                school: '',
                location: '',
                startDate: '',
                endDate: '',
                gpa: ''
              })}
              disabled={loading}
            >
              <FaPlus /> Add Education
            </button>
          )}
        </div>
        
        <div className="education-list">
          {getProfileArray('education').map((edu) => (
            <div key={edu.id} className="education-item">
              {isEditing ? (
                <div className="education-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleArrayUpdate('education', edu.id, { degree: e.target.value })}
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>School/University</label>
                      <input
                        type="text"
                        value={edu.school || ''}
                        onChange={(e) => handleArrayUpdate('education', edu.id, { school: e.target.value })}
                        placeholder="e.g. University of California"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={edu.location || ''}
                        onChange={(e) => handleArrayUpdate('education', edu.id, { location: e.target.value })}
                        placeholder="e.g. Berkeley, CA"
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate || ''}
                        onChange={(e) => handleArrayUpdate('education', edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="month"
                        value={edu.endDate || ''}
                        onChange={(e) => handleArrayUpdate('education', edu.id, { endDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => handleArrayUpdate('education', edu.id, { gpa: e.target.value })}
                        placeholder="e.g. 3.8/4.0"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleArrayDelete('education', edu.id)}
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="education-display">
                  <div className="education-header">
                    <h4>{edu.degree}</h4>
                    <span className="school">{edu.school}</span>
                    <span className="location">{edu.location}</span>
                    <span className="duration">
                      {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - 
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </span>
                    {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {getProfileArray('education').length === 0 && !isEditing && (
          <div className="empty-state">
            <p>No education information added yet.</p>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Professional Certifications</h3>
          {isEditing && (
            <button
              type="button"
              className="add-btn"
              onClick={() => handleArrayAdd('certifications', {
                name: '',
                issuer: '',
                date: '',
                credentialId: ''
              })}
              disabled={loading}
            >
              <FaPlus /> Add Certification
            </button>
          )}
        </div>
        
        <div className="certifications-list">
          {getProfileArray('certifications').map((cert) => (
            <div key={cert.id} className="certification-item">
              {isEditing ? (
                <div className="certification-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Certification Name</label>
                      <input
                        type="text"
                        value={cert.name || ''}
                        onChange={(e) => handleArrayUpdate('certifications', cert.id, { name: e.target.value })}
                        placeholder="e.g. AWS Certified Solutions Architect"
                      />
                    </div>
                    <div className="form-group">
                      <label>Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuer || ''}
                        onChange={(e) => handleArrayUpdate('certifications', cert.id, { issuer: e.target.value })}
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div className="form-group">
                      <label>Issue Date</label>
                      <input
                        type="month"
                        value={cert.date || ''}
                        onChange={(e) => handleArrayUpdate('certifications', cert.id, { date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Credential ID (Optional)</label>
                      <input
                        type="text"
                        value={cert.credentialId || ''}
                        onChange={(e) => handleArrayUpdate('certifications', cert.id, { credentialId: e.target.value })}
                        placeholder="e.g. ABC123XYZ"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleArrayDelete('certifications', cert.id)}
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <div className="certification-display">
                  <div className="certification-header">
                    <h4>{cert.name}</h4>
                    <span className="issuer">{cert.issuer}</span>
                    <span className="date">
                      {cert.date ? new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </span>
                    {cert.credentialId && <span className="credential">ID: {cert.credentialId}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {getProfileArray('certifications').length === 0 && !isEditing && (
          <div className="empty-state">
            <p>No certifications added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(EducationTab);
