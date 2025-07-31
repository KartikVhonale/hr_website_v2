import React from 'react';
import { FaUser, FaBriefcase, FaCode, FaGraduationCap } from 'react-icons/fa';

const ProfileTabs = ({ activeTab, handleTabChange }) => {
  return (
    <div className="profile-tabs">
      <button 
        type="button"
        className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
        onClick={() => handleTabChange('basic')}
      >
        <FaUser /> Basic Info
      </button>
      <button 
        type="button"
        className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
        onClick={() => handleTabChange('experience')}
      >
        <FaBriefcase /> Experience
      </button>
      <button 
        type="button"
        className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
        onClick={() => handleTabChange('skills')}
      >
        <FaCode /> Skills
      </button>
      <button 
        type="button"
        className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
        onClick={() => handleTabChange('education')}
      >
        <FaGraduationCap /> Education
      </button>
    </div>
  );
};

export default React.memo(ProfileTabs);
