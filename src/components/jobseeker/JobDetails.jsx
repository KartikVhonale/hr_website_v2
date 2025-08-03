import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, FaCalendarAlt, FaBookmark, FaRegBookmark, FaArrowLeft, FaShare } from 'react-icons/fa';
import jobsAPI from '../../api/jobs';
import jobseekerAPI from '../../api/jobseeker';
import applicationsAPI from '../../api/applications';
import '../../css/JobDetails.css';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Application form state
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    expectedSalary: '',
    availableFrom: '',
    additionalInfo: ''
  });

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
    if (hasApplied) {
      alert('You have already applied for this job');
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    try {
      setApplying(true);

      // Prepare application data according to API signature
      const appData = {
        coverLetter: applicationData.coverLetter,
        expectedSalary: applicationData.expectedSalary,
        availableFrom: applicationData.availableFrom,
        additionalInfo: applicationData.additionalInfo
      };

      // Add resume if provided
      if (applicationData.resume) {
        appData.resume = applicationData.resume;
      }

      const response = await applicationsAPI.submitApplication(jobId, appData);

      if (response && response.success) {
        alert('Application submitted successfully!');
        setHasApplied(true);
        setShowApplicationForm(false);
        setApplicationData({
          coverLetter: '',
          resume: null,
          expectedSalary: '',
          availableFrom: '',
          additionalInfo: ''
        });
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplicationData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setApplicationData(prev => ({ ...prev, [name]: value }));
    }
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

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="application-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Apply for {job.title}</h2>
              <button onClick={() => setShowApplicationForm(false)} className="close-btn">×</button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="application-form">
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
                <label htmlFor="resume">Resume (Optional)</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx"
                />
                <small>Upload your latest resume (PDF, DOC, DOCX)</small>
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
                <button type="button" onClick={() => setShowApplicationForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={applying} className="submit-btn">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
