import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, FaCalendarAlt, FaBookmark, FaRegBookmark, FaArrowLeft, FaShare, FaUser, FaEnvelope } from 'react-icons/fa';
import jobsAPI from '../../api/jobs';
import jobseekerAPI from '../../api/jobseeker';
import applicationsAPI from '../../api/applications';
import { useAuth } from '../../context/AuthContext';
import ApplyJobModal from '../modal/ApplyJobModal';
import '../../css/JobDetails.css';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    console.log('JobDetails useEffect - jobId:', jobId);
    if (jobId) {
      fetchJobDetails();
      checkIfSaved();
      checkIfApplied();
    } else {
      console.error('No jobId provided in URL parameters');
      setError('Invalid job ID');
      setLoading(false);
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching job details for ID:', jobId);

      const response = await jobsAPI.getJobById(jobId);
      console.log('Job details response:', response);

      // The API returns response.data directly, which contains { success: true, data: job }
      if (response && response.success) {
        setJob(response.data);
        console.log('Job details loaded:', response.data);
        console.log('Job description:', response.data.description);
        console.log('Description length:', response.data.description?.length);
      } else {
        console.warn('Job not found or API response failed:', response);
        setError('Job not found');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await jobseekerAPI.getSavedJobs();
      if (response.data && response.data.success) {
        const savedJobIds = response.data.data.map(job => job._id);
        setIsSaved(savedJobIds.includes(jobId));
      }
    } catch (err) {
      console.error('Error checking saved status:', err);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await applicationsAPI.getUserApplications();
      if (response.data && response.data.success) {
        const appliedJobIds = response.data.data.map(app => app.job._id || app.job);
        setHasApplied(appliedJobIds.includes(jobId));
      }
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        await jobseekerAPI.unsaveJob(jobId);
        setIsSaved(false);
      } else {
        await jobseekerAPI.saveJob(jobId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving/unsaving job:', err);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/job/${jobId}`,
          message: 'You must be logged in as a Jobseeker to apply.' 
        } 
      });
      return;
    }

    if (user.role !== 'jobseeker') {
      navigate('/login', { 
        state: { 
          from: `/job/${jobId}`,
          message: `You are logged in as an ${user.role}. Please log in as a Jobseeker to apply.`
        } 
      });
      return;
    }
    
    if (hasApplied) {
      alert('You have already applied for this job');
      return;
    }

    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    setShowApplicationForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return `$${salary.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="job-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-container">
        <div className="error-state">
          <h2>Job Not Found</h2>
          <p>{error || 'The job you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/jobs')} className="back-btn">
            <FaArrowLeft /> Back to Job Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      {/* Header */}
      <div className="job-details-header">
        <button onClick={() => navigate('/jobs')} className="back-btn">
          <FaArrowLeft /> Back to Jobs
        </button>
        <div className="header-actions">
          <button onClick={handleSaveJob} className={`save-btn ${isSaved ? 'saved' : ''}`}>
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </button>
          <button className="share-btn">
            <FaShare /> Share
          </button>
        </div>
      </div>

      {/* Job Information */}
      <div className="job-details-content">
        <div className="job-main-info">
          <div className="job-title-section">
            <h1>{job.title}</h1>
            <div className="company-info">
              <FaBuilding />
              <span>{job.company}</span>
            </div>
          </div>

          <div className="job-meta-info">
            <div className="meta-item">
              <FaMapMarkerAlt />
              <span>{job.location}</span>
            </div>
            <div className="meta-item">
              <FaClock />
              <span>{job.jobType}</span>
            </div>
            <div className="meta-item">
              <FaDollarSign />
              <span>{formatSalary(job.ctc || job.salary)}</span>
            </div>
            <div className="meta-item">
              <FaCalendarAlt />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>

          <div className="job-description">
            <h2>Job Description</h2>
            <div className="description-content">
              {job.description && job.description.trim() ? (
                job.description.split('\n').map((paragraph, index) => {
                  const trimmedParagraph = paragraph.trim();
                  if (trimmedParagraph) {
                    return (
                      <p key={index} className="description-paragraph">
                        {trimmedParagraph}
                      </p>
                    );
                  } else {
                    return <br key={index} />;
                  }
                })
              ) : (
                <div className="no-description">
                  <p>No detailed job description provided.</p>
                  <p>Please contact the employer for more information about this position.</p>
                </div>
              )}
            </div>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="job-skills">
              <h2>Required Skills</h2>
              <div className="skills-list">
                {job.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {job.experienceLevel && (
            <div className="job-requirements">
              <h2>Requirements</h2>
              <ul>
                <li>Experience Level: {job.experienceLevel}</li>
                {job.education && <li>Education: {job.education}</li>}
                {job.workMode && <li>Work Mode: {job.workMode}</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Application Section */}
        <div className="job-application-section">
          <div className="application-card">
            <h3>Apply for this position</h3>
            {hasApplied ? (
              <div className="already-applied">
                <p>✅ You have already applied for this job</p>
                <button onClick={() => navigate('/jobseeker/applications')} className="view-application-btn">
                  View Application Status
                </button>
              </div>
            ) : (
              <div className="apply-section">
                <p>Ready to take the next step in your career?</p>
                <button onClick={handleApplyClick} className="apply-now-btn">
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyJobModal
        isOpen={showApplicationForm}
        onRequestClose={() => setShowApplicationForm(false)}
        job={job}
        user={user}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JobDetails;
