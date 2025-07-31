import React, { useState, useEffect } from 'react';
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
import { getSavedJobs, unsaveJob } from '../../services/jobseekerService';
import '../../css/SavedJobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await getSavedJobs();
      setSavedJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    setLoading(true);
    try {
      await unsaveJob(jobId);
      fetchSavedJobs(); // Refetch the saved jobs list
    } catch (err) {
      console.error('Failed to unsave job:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedJobs = savedJobs
    .filter(job => {
      // Filter by search term
      const matchesSearch = !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by job type
      const matchesFilter = filterBy === 'all' ||
        job.jobType.toLowerCase().replace(' ', '-') === filterBy;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'company':
          return a.company.name.localeCompare(b.company.name);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
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
            <span className="stat-number">{savedJobs.length}</span>
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

      <div className="saved-jobs-list">
        {filteredAndSortedJobs.length > 0 ? (
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
                <p className="company-name">{job.company.name}</p>
                
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
                  {job.skills && job.skills.slice(0, 3).map((skill, index) => (
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
                  onClick={() => alert(`Applying for ${job.title} at ${job.company}`)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
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
              onClick={() => window.location.href = '#job-search'}
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
