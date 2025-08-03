import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getJobseekerProfile, updateJobseekerProfile } from '../../../services/jobseekerService';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import BasicInfoTab from './BasicInfoTab';
import ExperienceTab from './ExperienceTab';
import SkillsTab from './SkillsTab';
import EducationTab from './EducationTab';
import '../../../css/ProfileManagement.css';

const ProfileManagement = ({ user }) => {
  const { updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  // Helper function to ensure array items have IDs
  const ensureArrayItemsHaveIds = (array, prefix) => {
    if (!Array.isArray(array)) return [];
    return array.map((item, index) => ({
      ...item,
      id: item.id || item._id || `${prefix}-${index}-${Date.now()}`
    }));
  };

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    jobTitle: user?.jobTitle || '',
    summary: user?.summary || '',
    // NEW FORMAT ONLY - social links from socialLinks object
    linkedin: user?.socialLinks?.linkedin || '',
    github: user?.socialLinks?.github || '',
    portfolio: user?.socialLinks?.portfolio || '',
    experience: ensureArrayItemsHaveIds(user?.experience, 'exp'),
    education: ensureArrayItemsHaveIds(user?.education, 'edu'),
    skills: user?.skills || [],
    certifications: ensureArrayItemsHaveIds(user?.certifications, 'cert'),
    resume: user?.resume || null
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile data when user prop changes (only once)
  useEffect(() => {
    if (user && !profileData.name) {
      // Helper function to ensure array items have IDs
      const ensureArrayItemsHaveIds = (array, prefix) => {
        if (!Array.isArray(array)) return [];
        return array.map((item, index) => ({
          ...item,
          id: item.id || item._id || `${prefix}-${index}-${Date.now()}`
        }));
      };

      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        jobTitle: user.jobTitle || '',
        summary: user.summary || '',
        // NEW FORMAT ONLY - social links from socialLinks object
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || '',
        portfolio: user.socialLinks?.portfolio || '',
        experience: ensureArrayItemsHaveIds(user.experience, 'exp'),
        education: ensureArrayItemsHaveIds(user.education, 'edu'),
        skills: user.skills || [],
        certifications: ensureArrayItemsHaveIds(user.certifications, 'cert'),
        resume: user.resume || null
      });
    }
  }, [user, profileData.name]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getJobseekerProfile();

      let userData = null;

      // Handle different response structures
      if (res.data) {
        if (res.data.success && res.data.data) {
          userData = res.data.data;
        } else if (res.data._id || res.data.name || res.data.email) {
          userData = res.data;
        }
      }
      
      if (userData) {
        // Helper function to ensure array items have IDs
        const ensureArrayItemsHaveIds = (array, prefix) => {
          if (!Array.isArray(array)) return [];
          return array.map((item, index) => ({
            ...item,
            id: item.id || item._id || `${prefix}-${index}-${Date.now()}`
          }));
        };

        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          jobTitle: userData.jobTitle || '',
          summary: userData.summary || '',
          // NEW FORMAT ONLY - social links from socialLinks object
          linkedin: userData.socialLinks?.linkedin || '',
          github: userData.socialLinks?.github || '',
          portfolio: userData.socialLinks?.portfolio || '',
          experience: ensureArrayItemsHaveIds(userData.experience, 'exp'),
          education: ensureArrayItemsHaveIds(userData.education, 'edu'),
          skills: userData.skills || [],
          certifications: ensureArrayItemsHaveIds(userData.certifications, 'cert'),
          resume: userData.resume || null
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      console.error('Error details:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Helper function to safely get profile values
  const getProfileValue = useCallback((field) => {
    return profileData && profileData[field] ? profileData[field] : '';
  }, [profileData]);

  // Helper function to safely get profile arrays with IDs
  const getProfileArray = (field) => {
    if (!profileData || !Array.isArray(profileData[field])) {
      return [];
    }

    // Ensure each item has an ID for React keys
    return profileData[field].map((item, index) => ({
      ...item,
      id: item.id || item._id || `${field}-${index}-${Date.now()}`
    }));
  };

  // Add new item to array
  const handleArrayAdd = (arrayName, newItem) => {
    setProfileData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), { ...newItem, id: Date.now() }]
    }));
  };

  // Handle skills array specifically
  const handleSkillAdd = (skill) => {
    if (skill.trim() && !getProfileArray('skills').includes(skill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle array item updates by ID (for experience, education, certifications)
  const handleArrayUpdate = (arrayName, id, updatedFields) => {
    setProfileData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    }));
  };

  // Remove item from array by ID
  const handleArrayDelete = (arrayName, id) => {
    setProfileData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter(item => item.id !== id)
    }));
  };

  // Handle resume update
  const handleResumeUpdate = useCallback(async (resumeData) => {
    // Update local state immediately
    setProfileData(prev => ({
      ...prev,
      resume: resumeData
    }));

    // Also refresh the profile from backend to ensure consistency
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Failed to refresh profile after resume update:', error);
    }
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Clean the data before sending to backend
      const cleanedData = {
        ...profileData,
        // Remove temporary IDs from arrays and clean up empty fields
        experience: profileData.experience?.map(exp => {
          const { id, ...cleanExp } = exp;
          return cleanExp;
        }).filter(exp => exp.title || exp.company) || [],
        education: profileData.education?.map(edu => {
          const { id, ...cleanEdu } = edu;
          return cleanEdu;
        }).filter(edu => edu.degree || edu.school) || [],
        certifications: profileData.certifications?.map(cert => {
          const { id, ...cleanCert } = cert;
          return cleanCert;
        }).filter(cert => cert.name || cert.issuer) || [],
        // Ensure skills is an array
        skills: Array.isArray(profileData.skills) ? profileData.skills : []
      };

      const res = await updateJobseekerProfile(cleanedData);

      if (res.data) {
        if (res.data.success) {
          if (res.data.data) {
            setProfileData(res.data.data);
            // Update the user context with the new profile data
            updateUser(res.data.data);
          }
          setIsEditing(false);
          alert('Profile saved successfully!');
        } else if (res.data._id || res.data.name) {
          setProfileData(res.data);
          // Update the user context with the new profile data
          updateUser(res.data);
          setIsEditing(false);
          alert('Profile saved successfully!');
        } else {
          console.error('Failed to update profile:', res.data?.msg || 'Unknown error');
          console.error('Response data:', res.data);
          alert(`Failed to save profile: ${res.data?.msg || 'Unknown error'}`);
        }
      } else {
        console.error('No response data received');
        alert('Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      console.error('Error details:', err.response?.data || err.message);

      // More detailed error message
      let errorMessage = 'Failed to save profile. Please try again.';
      if (err.response?.data?.msg) {
        errorMessage = `Failed to save profile: ${err.response.data.msg}`;
      } else if (err.response?.data?.errors) {
        errorMessage = `Validation errors: ${err.response.data.errors.join(', ')}`;
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 6;
    
    if (profileData.name && profileData.email) completed++;
    if (profileData.phone && profileData.location) completed++;
    if (profileData.jobTitle && profileData.summary) completed++;
    if (profileData.experience && profileData.experience.length > 0) completed++;
    if (profileData.skills && profileData.skills.length > 0) completed++;
    if (profileData.linkedin || profileData.github || profileData.portfolio) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Show loading state while fetching profile data
  if (loading && !profileData.name) {
    return (
      <div className="profile-management-section">
        <div className="loading-state">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const commonProps = {
    profileData,
    isEditing,
    loading,
    getProfileValue,
    getProfileArray,
    handleInputChange,
    handleArrayAdd,
    handleArrayUpdate,
    handleArrayDelete,
    handleSkillAdd,
    handleSkillRemove,
    newSkill,
    setNewSkill,
    onResumeUpdate: handleResumeUpdate
  };

  return (
    <div 
      className="profile-management-section"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
          e.preventDefault();
        }
      }}
    >
      <ProfileHeader
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        loading={loading}
        calculateProfileCompletion={calculateProfileCompletion}
        handleSaveProfile={handleSaveProfile}
      />

      <ProfileTabs
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <div className="profile-content">
        {activeTab === 'basic' && <BasicInfoTab {...commonProps} />}
        {activeTab === 'experience' && <ExperienceTab {...commonProps} />}
        {activeTab === 'skills' && <SkillsTab {...commonProps} />}
        {activeTab === 'education' && <EducationTab {...commonProps} />}
      </div>
    </div>
  );
};

export default React.memo(ProfileManagement);
