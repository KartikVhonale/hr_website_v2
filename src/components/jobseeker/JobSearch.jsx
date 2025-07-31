import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../../services/jobService';
import { saveJob, unsaveJob } from '../../services/jobseekerService';
import { JobCard } from '../ui/cards';
import '../../css/JobSearch.css';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaFilter
} from 'react-icons/fa';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        location,
        jobType,
      };
      const res = await getAllJobs(params);
      setJobs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const toggleSaveJob = async (jobId) => {
    setLoading(true);
    try {
      const newSavedJobs = new Set(savedJobs);
      if (newSavedJobs.has(jobId)) {
        await unsaveJob(jobId);
        newSavedJobs.delete(jobId);
      } else {
        await saveJob(jobId);
        newSavedJobs.add(jobId);
      }
      setSavedJobs(newSavedJobs);
    } catch (err) {
      console.error('Failed to save/unsave job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    setLoading(true);
    try {
      // In a real implementation, you would collect application data from a form
      const applicationData = {
        resume: 'path/to/resume.pdf', // This would be the actual resume file
        coverLetter: 'path/to/cover-letter.pdf' // This would be the actual cover letter file
      };
      
      const data = await jobseekerService.applyForJob(job._id, applicationData, token);
      if (data.success) {
        alert('Application submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to apply for job:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-search-section">
      <div className="search-header">
        <div className="header-content">
          <h2>Find Your Dream Job</h2>
          <p>Search through thousands of job listings to find your perfect match</p>
        </div>
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
            />
          </div>
          
          <div className="search-input-group">
            <FaMapMarkerAlt className="search-icon" />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
          
          <button className="search-btn" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
        </div>

        {showFilters && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Job Type</label>
                <select 
                  value={jobType} 
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
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
                >
                  <option value="">Any Salary</option>
                  <option value="0-30000">Up to $30,000</option>
                  <option value="30000-50000">$30,000 - $50,000</option>
                  <option value="50000-70000">$50,000 - $70,000</option>
                  <option value="70000+">$70,000+</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="search-results">
        <div className="results-header">
          <h3>{jobs.length} Jobs Found</h3>
          <div className="sort-options">
            <span>Sort by:</span>
            <select>
              <option>Most Relevant</option>
              <option>Newest</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
        </div>

        <div className="jobs-grid">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job._id}
                jobTitle={job.title}
                company={job.employer.name}
                location={job.location}
                jobType={job.jobType}
                salary={job.salary}
                postedDate={job.createdAt}
                description={job.description}
                skills={job.skills}
                isSaved={savedJobs.has(job._id)}
                onSave={() => toggleSaveJob(job._id)}
                onApply={() => handleApply(job)}
                loading={loading}
              />
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
