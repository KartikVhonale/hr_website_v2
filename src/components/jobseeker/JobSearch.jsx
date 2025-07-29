import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaFilter,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaDollarSign,
  FaBuilding
} from 'react-icons/fa';

const JobSearch = ({ jobs, setJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, location, jobType, salaryRange, jobs]);

  const filterJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      
      const matchesJobType = !jobType || job.type === jobType;
      
      const matchesSalary = !salaryRange || checkSalaryRange(job.salary, salaryRange);
      
      return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
    });
    
    setFilteredJobs(filtered);
  };

  const checkSalaryRange = (jobSalary, range) => {
    if (!jobSalary) return false;
    
    const salary = parseInt(jobSalary.replace(/[^0-9]/g, ''));
    
    switch (range) {
      case '0-30000':
        return salary <= 30000;
      case '30000-50000':
        return salary >= 30000 && salary <= 50000;
      case '50000-70000':
        return salary >= 50000 && salary <= 70000;
      case '70000+':
        return salary >= 70000;
      default:
        return true;
    }
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleApply = (job) => {
    // This would typically open an application modal or redirect to application page
    alert(`Applying for ${job.title} at ${job.company}`);
  };

  return (
    <div className="job-search-section">
      <div className="search-header">
        <h2>Find Your Next Opportunity</h2>
        <p>Discover jobs that match your skills and interests</p>
      </div>

      <div className="search-controls">
        <div className="search-bar">
          <div className="search-input-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="location-input-group">
            <FaMapMarkerAlt className="location-icon" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-input"
            />
          </div>
          
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Job Type</label>
              <select 
                value={jobType} 
                onChange={(e) => setJobType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Salary Range</label>
              <select 
                value={salaryRange} 
                onChange={(e) => setSalaryRange(e.target.value)}
                className="filter-select"
              >
                <option value="">Any Salary</option>
                <option value="0-30000">$0 - $30,000</option>
                <option value="30000-50000">$30,000 - $50,000</option>
                <option value="50000-70000">$50,000 - $70,000</option>
                <option value="70000+">$70,000+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="search-results">
        <div className="results-header">
          <h3>{filteredJobs.length} Jobs Found</h3>
          <div className="sort-controls">
            <select className="sort-select">
              <option value="relevance">Most Relevant</option>
              <option value="date">Most Recent</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        <div className="jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <div className="company-logo">
                    <FaBuilding />
                  </div>
                  <button 
                    className={`save-btn ${savedJobs.has(job._id) ? 'saved' : ''}`}
                    onClick={() => toggleSaveJob(job._id)}
                  >
                    {savedJobs.has(job._id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                
                <div className="job-card-content">
                  <h4 className="job-title">{job.title}</h4>
                  <p className="company-name">{job.company}</p>
                  
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
                    {job.description.substring(0, 150)}...
                  </p>
                  
                  <div className="job-tags">
                    {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="job-card-footer">
                  <span className="posted-date">
                    <FaClock />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
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
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <FaSearch />
              </div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setLocation('');
                  setJobType('');
                  setSalaryRange('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
