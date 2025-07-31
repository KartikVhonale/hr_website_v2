import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const SkillsTab = ({ 
  getProfileArray, 
  handleSkillAdd, 
  handleSkillRemove, 
  isEditing, 
  loading, 
  newSkill, 
  setNewSkill 
}) => {
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      handleSkillAdd(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  return (
    <div className="tab-content">
      <div className="profile-section">
        <div className="section-header">
          <h3>Professional Skills & Expertise</h3>
          {isEditing && (
            <div className="skill-input-group">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a skill (e.g. JavaScript, React, Node.js)"
                disabled={loading}
              />
              <button
                type="button"
                className="add-btn"
                onClick={handleAddSkill}
                disabled={loading || !newSkill.trim()}
              >
                <FaPlus /> Add Skill
              </button>
            </div>
          )}
        </div>
        
        <div className="skills-grid">
          {getProfileArray('skills').map((skill, index) => (
            <div key={index} className="skill-item">
              <span className="skill-name">{skill}</span>
              {isEditing && (
                <button
                  type="button"
                  className="delete-btn small"
                  onClick={() => handleSkillRemove(skill)}
                  disabled={loading}
                  title="Remove skill"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {getProfileArray('skills').length === 0 && !isEditing && (
          <div className="empty-state">
            <p>No skills added yet.</p>
          </div>
        )}
        
        {isEditing && (
          <div className="skills-help">
            <p><strong>Tip:</strong> Add relevant technical and soft skills that showcase your expertise. Examples: JavaScript, Project Management, Communication, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SkillsTab);
