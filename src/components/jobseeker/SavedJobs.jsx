import React, { useState } from 'react';
import { 
  FaHeart, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaDollarSign,
  FaClock,
  FaBuilding,
  FaTrash,
  FaEye,
  FaFilter,
  FaSort
} from 'react-icons/fa';

const SavedJobs = ({ savedJobs, setSavedJobs }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock saved jobs data - in real app this would come from API
  const mockSavedJobs = [
    {
      _id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$80,000 - $100,000',
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team...',
      skills: ['React', 'JavaScript', 'CSS'],
      savedAt: '2024-01-15',
      status: 'active',
      urgency: 'high'
    },
    {
      _id: '2',
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      type: 'contract',
      salary: '$70,000 - $90,000',
      description: 'Join our creative team as a UX Designer and help create amazing user experiences...',
      skills: ['Figma', 'Sketch', 'User Research'],
      savedAt: '2024-01-10',
      status: 'active',
      urgency: 'medium'
    },
    {
      _id: '3',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      type: 'full-time',
      salary: '$90,000 - $120,000',
      description: 'Lead product development and strategy for our innovative platform...',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      savedAt: '2024-01-05',
      status: 'expired',
      urgency: 'low'
    }
  ];

  const [displayJobs, setDisplayJobs] = useState(mockSavedJobs);

  const handleRemoveJob = (jobId) => {
    setDisplayJobs(displayJobs.filter(job => job._id !== jobId));
  };

  const handleApply = (job) => {
    alert(`Applying for ${job.title} at ${job.company}`);
  };

  const handleViewDetails = (job) => {
    alert(`Viewing details for ${job.title}`);
  };

  const sortJobs = (jobs, sortBy) => {
    const sorted = [...jobs];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'company':
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      case 'urgency':
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);
      default:
        return sorted;
    }
  };

  const filterJobs = (jobs, filterBy) => {
    switch (filterBy) {
      case 'active':
        return jobs.filter(job => job.status === 'active');
      case 'expired':
        return jobs.filter(job => job.status === 'expired');
      case 'full-time':
        return jobs.filter(job => job.type === 'full-time');
      case 'contract':
        return jobs.filter(job => job.type === 'contract');
      default:
        return jobs;
    }
  };

  const filteredAndSortedJobs = sortJobs(filterJobs(displayJobs, filterBy), sortBy);

  return (
    <div className="saved-jobs-section">
      <div className="saved-jobs-header">
        <div className="header-content">
          <h2>Saved Jobs</h2>
          <p>Keep track of jobs you're interested in</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{displayJobs.length}</span>
            <span className="stat-label">Total Saved</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{displayJobs.filter(job => job.status === 'active').length}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      <div className="saved-jobs-controls">
        <div className="controls-left">
          <div className="filter-group">
            <FaFilter className="control-icon" />
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="control-select"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="full-time">Full Time</option>
              <option value="contract">Contract</option>
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
              <option value="urgency">Urgency</option>
            </select>
          </div>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      <div className={`saved-jobs-container ${viewMode}`}>
        {filteredAndSortedJobs.length > 0 ? (
          filteredAndSortedJobs.map((job) => (
            <div key={job._id} className={`saved-job-card ${job.status}`}>
              <div className="job-card-header">
                <div className="company-info">
                  <div className="company-logo">
                    <FaBuilding />
                  </div>
                  <div className="company-details">
                    <h4 className="job-title">{job.title}</h4>
                    <p className="company-name">{job.company}</p>
                  </div>
                </div>
                <div className="job-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetails(job)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn remove-btn"
                    onClick={() => handleRemoveJob(job._id)}
                    title="Remove from Saved"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="job-card-content">
                <div className="job-details">
                  <span className="job-location">
                    <FaMapMarkerAlt />
                    {job.location}
                  </span>
                  <span className="job-type">
                    <FaBriefcase />
                    {job.type}
                  </span>
                  {job.salary && (
                    <span className="job-salary">
                      <FaDollarSign />
                      {job.salary}
                    </span>
                  )}
                </div>

                <p className="job-description">
                  {job.description.substring(0, 120)}...
                </p>

                <div className="job-tags">
                  {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="job-card-footer">
                <div className="job-meta">
                  <span className="saved-date">
                    <FaHeart />
                    Saved {new Date(job.savedAt).toLocaleDateString()}
                  </span>
                  <span className={`urgency-badge ${job.urgency}`}>
                    {job.urgency} priority
                  </span>
                </div>
                <div className="job-card-actions">
                  {job.status === 'active' ? (
                    <button 
                      className="apply-btn primary"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now
                    </button>
                  ) : (
                    <button className="apply-btn disabled" disabled>
                      Position Closed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-saved-jobs">
            <div className="empty-icon">
              <FaHeart />
            </div>
            <h3>No saved jobs found</h3>
            <p>
              {filterBy === 'all' 
                ? "You haven't saved any jobs yet. Start browsing and save jobs you're interested in!"
                : `No jobs found matching the "${filterBy}" filter.`
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
