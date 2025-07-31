import React from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';

const ProfileHeader = ({ 
  isEditing, 
  setIsEditing, 
  loading, 
  calculateProfileCompletion, 
  handleSaveProfile 
}) => {
  return (
    <div className="profile-header">
      <div className="header-content">
        <h2>Profile Management</h2>
        <p>Keep your profile up-to-date to attract the right opportunities</p>
      </div>
      <div className="header-actions">
        <div className="profile-completion">
          <div 
            className="completion-circle" 
            style={{ '--percent': calculateProfileCompletion() }}
          >
            <span>{calculateProfileCompletion()}%</span>
          </div>
          <span>Profile Complete</span>
        </div>
        {isEditing ? (
          <button 
            type="button"
            className="edit-btn save"
            onClick={handleSaveProfile}
            disabled={loading}
          >
            {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
          </button>
        ) : (
          <button 
            type="button"
            className="edit-btn edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);
