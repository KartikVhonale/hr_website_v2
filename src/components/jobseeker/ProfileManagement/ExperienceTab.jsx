import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ExperienceTab = ({ 
  getProfileArray, 
  handleArrayAdd, 
  handleArrayUpdate, 
  handleArrayDelete, 
  isEditing, 
  loading 
}) => {
  return (
    <div className="tab-content">
      <div className="profile-section">
        <div className="section-header">
          <h3>Professional Work Experience</h3>
          {isEditing && (
            <button 
              type="button"
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
              disabled={loading}
            >
              <FaPlus /> Add Experience
            </button>
          )}
        </div>
        
        <div className="experience-list">
          {getProfileArray('experience').map((exp) => (
            <div key={exp.id} className="experience-item">
              {isEditing ? (
                <div className="experience-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input
                        type="text"
                        value={exp.title || ''}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { title: e.target.value })}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { company: e.target.value })}
                        placeholder="e.g. Google Inc."
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { location: e.target.value })}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate || ''}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="month"
                        value={exp.endDate || ''}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => handleArrayUpdate('experience', exp.id, { 
                            current: e.target.checked,
                            endDate: e.target.checked ? '' : exp.endDate
                          })}
                        />
                        Currently working here
                      </label>
                    </div>
                    <div className="form-group full-width">
                      <label>Job Description</label>
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => handleArrayUpdate('experience', exp.id, { description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="delete-btn"
                    onClick={() => handleArrayDelete('experience', exp.id)}
                    disabled={loading}
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
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - 
                      {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="experience-description">
                      <p>{exp.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {getProfileArray('experience').length === 0 && !isEditing && (
          <div className="empty-state">
            <p>No work experience added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ExperienceTab);
