import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import applicationsAPI from '../../api/applications';
import jobseekerAPI from '../../api/jobseeker';
import '../../css/ApplyJobModal.css';

const ApplyJobModal = ({ isOpen, onRequestClose, job, user, onApplicationSuccess }) => {
  const [applying, setApplying] = useState(false);
  const [profile, setProfile] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    expectedSalary: '',
    availableFrom: '',
    additionalInfo: ''
  });

  useEffect(() => {
    const fetchProfileAndPrefill = async () => {
      if (isOpen && user) {
        try {
          const profileResponse = await jobseekerAPI.getJobseekerProfile();
          if (profileResponse.data && profileResponse.data.success) {
            const jobseekerProfile = profileResponse.data.data;
            setProfile(jobseekerProfile);

            // Pre-fill form data from the detailed profile
            setApplicationData(prev => ({
              ...prev,
              name: user.name || '',
              email: user.email || '',
              coverLetter: `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job.title} position. With a background in ${jobseekerProfile.jobTitle || 'this field'} and experience with ${jobseekerProfile.skills?.join(', ') || 'relevant technologies'}, I am confident I have the skills and qualifications you are looking for.\n\nMy resume is attached for your review. Thank you for your time and consideration.\n\nSincerely,\n${user.name}`,
              expectedSalary: jobseekerProfile.preferences?.salaryRange?.min ? String(jobseekerProfile.preferences.salaryRange.min) : '',
              resume: jobseekerProfile.resume,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch jobseeker profile:", error);
        }
      }
    };

    fetchProfileAndPrefill();
  }, [isOpen, user, job]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplicationData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setApplicationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      const appData = {
        coverLetter: applicationData.coverLetter,
        expectedSalary: applicationData.expectedSalary,
        availableFrom: applicationData.availableFrom,
        additionalInfo: applicationData.additionalInfo,
        resume: applicationData.resume,
      };

      // If a new resume is not uploaded but exists in profile, use the existing one
      if (!appData.resume && profile && profile.resume) {
        appData.resume = profile.resume;
      }

      const response = await applicationsAPI.submitApplication(job._id, appData);

      if (response && response.data.success) {
        alert('Application submitted successfully!');
        onApplicationSuccess(); // Notify parent
      } else {
        const errorMessage = response?.data?.message || 'Failed to submit application. Please try again.';
        alert(errorMessage);
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      alert(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="apply-page">
      <div className="apply-page__content">
        <div className="apply-page__header">
          <h2>Apply for {job.title}</h2>
          <button onClick={onRequestClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleApplicationSubmit} className="application-form">
          <div className="applicant-info-preview">
            <div className="info-item">
              <FaUser />
              <span>{user?.name || 'Your Name'}</span>
            </div>
            <div className="info-item">
              <FaEnvelope />
              <span>{user?.email || 'your.email@example.com'}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter *</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={applicationData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell us why you're interested in this position..."
              required
              rows={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume</label>
            {profile?.resume?.url && (
              <div className="resume-info">
                <p>
                  <FaFileAlt /> A resume is on file: 
                  <a href={profile.resume.url} target="_blank" rel="noopener noreferrer">
                    {profile.resume.original_name}
                  </a>
                </p>
                <small>You can use this resume or upload a new one below.</small>
              </div>
            )}
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx"
            />
            <small>{profile?.resume?.url ? 'Upload a different resume (optional)' : 'Upload your resume (PDF, DOC, DOCX)'}</small>
            {profile?.resume?.url && (
              <button type="button" onClick={() => document.getElementById('resume').click()} className="edit-resume-btn">
                Edit Resume
              </button>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedSalary">Expected Salary</label>
              <input
                type="text"
                id="expectedSalary"
                name="expectedSalary"
                value={applicationData.expectedSalary}
                onChange={handleInputChange}
                placeholder="e.g., $50,000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="availableFrom">Available From</label>
              <input
                type="date"
                id="availableFrom"
                name="availableFrom"
                value={applicationData.availableFrom}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={applicationData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to share..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onRequestClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={applying} className="submit-btn">
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
