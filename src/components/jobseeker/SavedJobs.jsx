import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBookmark, 
  FaTrash,
  FaBuilding,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaFilter,
  FaSort,
  FaSearch
} from 'react-icons/fa';
import { jobseekerAPI } from '../../api/index.js';
import '../../css/SavedJobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadSavedJobs = async () => {
      if (isMounted) {
        await fetchSavedJobs();
      }
    };

    loadSavedJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await Promise.race([
        jobseekerAPI.getSavedJobs(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ]);

      console.log('SavedJobs API response:', response);

      // Handle the response structure: { success: true, data: [...] }
      let jobs = [];
      if (response && response.success) {
        jobs = response.data || [];
      } else if (response && response.data && response.data.success) {
        jobs = response.data.data || [];
      } else if (response && Array.isArray(response.data)) {
        // Fallback for direct array response
        jobs = response.data;
      } else if (response && Array.isArray(response)) {
        // Fallback for direct array response
        jobs = response;
      }

      console.log('Processed saved jobs:', jobs);

      // Ensure jobs is an array
      if (!Array.isArray(jobs)) {
        console.warn('Saved jobs data is not an array:', jobs);
        jobs = [];
      }

      setSavedJobs(jobs);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
      setError('Failed to load saved jobs. Please try again.');
      setSavedJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      setLoading(true);

      await Promise.race([
        jobseekerAPI.unsaveJob(jobId),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
      ]);

      // Optimistically update the UI
      setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));

      // Then refetch to ensure consistency
      await fetchSavedJobs();
    } catch (err) {
      console.error('Failed to unsave job:', err);
      setError('Failed to remove job. Please try again.');
      // Refetch to restore correct state
      await fetchSavedJobs();
    } finally {
      setLoading(false);
    }
  };
  const handleApply = (job) => {
    try {
      // Navigate to job details page where user can apply
      console.log('Navigating to job details for job:', job);
      console.log('Job ID:', job._id);

      if (!job._id) {
        console.error('Job ID is missing');
        setError('Unable to navigate to job details. Job ID is missing.');
        return;
      }

      navigate(`/job/${job._id}`);
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Unable to navigate to job details. Please try again.');
    }
  };

  // Ensure savedJobs is an array before filtering
  const jobsArray = Array.isArray(savedJobs) ? savedJobs : [];

  const filteredAndSortedJobs = jobsArray
    .filter(job => {
      // Safety check for job object
      if (!job || typeof job !== 'object') return false;

      // Filter by search term
      const companyName = job.employer?.name || job.employer?.company || job.company?.name || '';
      const matchesSearch = !searchTerm ||
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (companyName && companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by job type
      const matchesFilter = filterBy === 'all' ||
        (job.jobType && job.jobType.toLowerCase().replace(' ', '-') === filterBy);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Safety checks for sort comparison
      if (!a || !b) return 0;

      switch (sortBy) {
        case 'title':
          const titleA = a.title || '';
          const titleB = b.title || '';
          return titleA.localeCompare(titleB);
        case 'company':
          const companyA = a.employer?.name || a.employer?.company || a.company?.name || '';
          const companyB = b.employer?.name || b.employer?.company || b.company?.name || '';
          return companyA.localeCompare(companyB);
        case 'date':
        default:
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
      }
    });

  return (
    <div className="saved-jobs-section">
      <div className="saved-jobs-header">
        <div className="header-content">
          <h2>Saved Jobs</h2>
          <p>Jobs you've bookmarked for later</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{Array.isArray(savedJobs) ? savedJobs.length : 0}</span>
            <span className="stat-label">Saved Jobs</span>
          </div>
        </div>
      </div>

      <div className="saved-jobs-controls">
        <div className="search-group">
          <FaSearch className="control-icon" />
          <input
            type="text"
            placeholder="Search saved jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <FaFilter className="control-icon" />
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="control-select"
          >
            <option value="all">All Jobs</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        
        <div className="sort-group">
          <FaSort className="control-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="date">Date Saved</option>
            <option value="title">Job Title</option>
            <option value="company">Company</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchSavedJobs} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <p>Loading saved jobs...</p>
        </div>
      )}

      <div className="saved-jobs-list">
        {!loading && !error && filteredAndSortedJobs.length > 0 ? (
          filteredAndSortedJobs.map((job) => (
            <div key={job._id} className="saved-job-card">
              <div className="job-header">
                <div className="company-logo">
                  <FaBuilding />
                </div>
                <button 
                  className="unsave-btn"
                  onClick={() => handleUnsaveJob(job._id)}
                  disabled={loading}
                  title="Remove from saved jobs"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="job-content">
                <h4 className="job-title">{job.title}</h4>
                <p className="company-name">
                  {job.employer?.name || job.employer?.company || job.company?.name || 'Company Name'}
                </p>
                
                <div className="job-details">
                  <span className="job-location">
                    <FaMapMarkerAlt />
                    {job.location}
                  </span>
                  <span className="job-type">
                    <FaClock />
                    {job.jobType}
                  </span>
                  {job.salary && (
                    <span className="job-salary">
                      <FaDollarSign />
                      {job.salary}
                    </span>
                  )}
                </div>
                
                <p className="job-description">
                  {job.description?.substring(0, 150)}...
                </p>
                
                <div className="job-tags">
                  {job.skills && Array.isArray(job.skills) && job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="job-footer">
                <span className="saved-date">
                  Saved on {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <button 
                  className="apply-btn"
                  onClick={() => handleApply(job)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : !loading && !error ? (
          <div className="empty-saved-jobs">
            <div className="empty-icon">
              <FaBookmark />
            </div>
            <h3>No saved jobs found</h3>
            <p>
              {searchTerm
                ? "No saved jobs match your search criteria."
                : "You haven't saved any jobs yet. Start saving jobs that interest you!"
              }
            </p>
            <button
              className="browse-jobs-btn"
              onClick={() => {
                try {
                  navigate('/jobs');
                } catch (err) {
                  console.error('Navigation error:', err);
                  // Fallback to window location
                  window.location.href = '/jobs';
                }
              }}
            >
              Browse Jobs
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SavedJobs;
