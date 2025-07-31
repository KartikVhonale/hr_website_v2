import React from 'react';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import ResumeUpload from './ResumeUpload';

const BasicInfoTab = ({
  profileData,
  getProfileValue,
  handleInputChange,
  isEditing,
  loading,
  onResumeUpdate
}) => {
  return (
    <div className="tab-content">
      <div className="profile-section">
        <h3>Personal & Contact Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={getProfileValue('name')}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={getProfileValue('email')}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={getProfileValue('phone')}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={getProfileValue('location')}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group full-width">
            <label>Professional Title</label>
            <input
              type="text"
              value={getProfileValue('jobTitle')}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group full-width">
            <label>Professional Summary</label>
            <textarea
              value={getProfileValue('summary')}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Professional Social Links</h3>
        <div className="form-grid">
          <div className="form-group">
            <label><FaLinkedin /> LinkedIn</label>
            <input
              type="url"
              value={getProfileValue('linkedin')}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label><FaGithub /> GitHub</label>
            <input
              type="url"
              value={getProfileValue('github')}
              onChange={(e) => handleInputChange('github', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label><FaGlobe /> Portfolio</label>
            <input
              type="url"
              value={getProfileValue('portfolio')}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <ResumeUpload
          resumeData={profileData?.resume}
          onResumeUpdate={onResumeUpdate}
          isEditing={isEditing}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default React.memo(BasicInfoTab);
