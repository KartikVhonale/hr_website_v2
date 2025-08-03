import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, jobseekerAPI } from '../../api/index.js';
import { JobCard } from '../ui/cards';
import JobListItem from '../ui/cards/JobListItem';
import { useSearchFilters } from '../../hooks/useFormAutoSave.js';
import '../../css/JobSearch.css';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaFilter,
  FaTh,
  FaList
} from 'react-icons/fa';

const JobSearch = () => {
  const navigate = useNavigate();

  // Use search filters hook with cookie persistence
  const {
    filters,
    sortOptions,
    updateFilters,
    updateSort,
    clearFilters,
    addToSearchHistory,
    getSearchHistory
  } = useSearchFilters('jobs');

  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [location, setLocation] = useState(filters.location || '');
  const [jobType, setJobType] = useState(filters.jobType || '');
  const [experienceLevel, setExperienceLevel] = useState(filters.experienceLevel || '');
  const [salaryRange, setSalaryRange] = useState(filters.salaryRange || '');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState(() => getSearchHistory());
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  // Load saved jobs on component mount
  const loadSavedJobs = async () => {
    try {
      const response = await jobseekerAPI.getSavedJobs();

      console.log('Saved jobs response:', response);

      // Handle the response structure
      let savedJobsData = [];
      if (response && response.success) {
        savedJobsData = response.data || [];
      } else if (response && response.data && response.data.success) {
        savedJobsData = response.data.data || [];
      } else if (response && Array.isArray(response.data)) {
        // Fallback for direct array response
        savedJobsData = response.data;
      } else if (response && Array.isArray(response)) {
        // Fallback for direct array response
        savedJobsData = response;
      }

      console.log('Processed saved jobs:', savedJobsData);

      // Ensure savedJobsData is an array
      if (!Array.isArray(savedJobsData)) {
        console.warn('Saved jobs data is not an array:', savedJobsData);
        savedJobsData = [];
      }

      const savedJobIds = savedJobsData.map(job => job._id);
      setSavedJobs(new Set(savedJobIds));
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
      setSavedJobs(new Set()); // Set empty set on error
    }
  };

  useEffect(() => {
    // Load all jobs and saved jobs on component mount
    fetchJobs();
    loadSavedJobs();
  }, []);

  // Refetch jobs when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchJobs();
    }
  }, [currentPage]);

  const fetchJobs = async (searchParams = {}) => {
    setLoading(true);
    setError('');

    try {
      // Build search parameters
      const params = {
        q: searchTerm.trim(),
        location: location.trim(),
        jobType: jobType || '',
        experienceLevel: experienceLevel || '',
        salaryRange: salaryRange || '',
        page: currentPage,
        limit: 20,
        sortBy: sortOptions.sortBy || 'createdAt',
        sortOrder: sortOptions.sortOrder || 'desc',
        ...searchParams
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === '') {
          delete params[key];
        }
      });

      const response = await jobsAPI.getAllJobs(params);

      if (response && response.data && response.data.success) {
        const jobsData = response.data.data || [];
        setJobs(jobsData);
        setTotalJobs(response.data.total || jobsData.length);

        if (jobsData.length === 0) {
          setError('No jobs found. Try adjusting your search criteria.');
        }
      } else {
        setError('Failed to fetch jobs. Please try again.');
        setJobs([]);
        setTotalJobs(0);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
      setJobs([]);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page

    // Update filters in cookie storage
    updateFilters({
      searchTerm: searchTerm.trim(),
      location: location.trim(),
      jobType,
      experienceLevel,
      salaryRange
    });

    fetchJobs();
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'location':
        setLocation(value);
        break;
      case 'jobType':
        setJobType(value);
        break;
      case 'experienceLevel':
        setExperienceLevel(value);
        break;
      case 'salaryRange':
        setSalaryRange(value);
        break;
      default:
        break;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setSalaryRange('');
    setCurrentPage(1);
    clearFilters();
    fetchJobs();
  };

  const handleSortChange = (sortBy, sortOrder = 'desc') => {
    updateSort(sortBy, sortOrder);
    setCurrentPage(1);
    fetchJobs();
  };

  const toggleSaveJob = async (jobId) => {
    setLoading(true);
    try {
      const newSavedJobs = new Set(savedJobs);
      if (newSavedJobs.has(jobId)) {
        await jobseekerAPI.unsaveJob(jobId);
        newSavedJobs.delete(jobId);
      } else {
        await jobseekerAPI.saveJob(jobId);
        newSavedJobs.add(jobId);
      }
      setSavedJobs(newSavedJobs);
    } catch (err) {
      console.error('Failed to save/unsave job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    // Navigate to job details page where user can apply
    console.log('Navigating to job details for job:', job);
    console.log('Job ID:', job._id);
    navigate(`/job/${job._id}`);
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
          <h3>
            {loading ? 'Loading...' : `${totalJobs || jobs.length} Jobs Found`}
          </h3>
          <div className="results-controls">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FaTh />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FaList />
              </button>
            </div>

            {/* Sort Options */}
            <div className="sort-options">
              <span>Sort by:</span>
              <select
                value={`${sortOptions.sortBy}-${sortOptions.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleSortChange(sortBy, sortOrder);
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="company-asc">Company A-Z</option>
                <option value="location-asc">Location A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchJobs()}>Try Again</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        )}

        <div className={`jobs-container ${viewMode === 'list' ? 'jobs-list' : 'jobs-grid'}`}>
          {!loading && jobs.length > 0 ? (
            jobs.map((job) => {
              const jobProps = {
                jobTitle: job.title,
                company: job.employer?.name || 'Company Name',
                location: job.location,
                jobType: job.jobType,
                salary: job.ctc || job.salary,
                postedDate: job.createdAt,
                description: job.description,
                skills: job.skills,
                isSaved: savedJobs.has(job._id),
                onSave: () => toggleSaveJob(job._id),
                onApply: () => handleApply(job),
                loading: false
              };

              return viewMode === 'list' ? (
                <JobListItem key={job._id} {...jobProps} />
              ) : (
                <JobCard key={job._id} {...jobProps} />
              );
            })
          ) : !loading && jobs.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <FaSearch />
              </div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {!loading && jobs.length > 0 && totalJobs > 20 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {Math.ceil(totalJobs / 20)}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalJobs / 20)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
