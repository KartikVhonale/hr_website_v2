import React, { useState, useEffect } from 'react';
import { employerAPI, jobsAPI } from '../../api/index.js';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaBuilding,
  FaDollarSign,
  FaClock,
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import '../../css/ManageJobs.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await employerAPI.getPostedJobs();

      // Handle the response structure: { data: { success: true, data: [...] } }
      const apiResponse = response.data;

      if (apiResponse && apiResponse.success) {
        setJobs(apiResponse.data || []);
      } else {
        console.warn('API response indicates failure:', apiResponse);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(jobId);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  // Filter jobs based on search and status
  // Ensure jobs is always an array before filtering
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  const filteredJobs = jobsArray.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="manage-jobs-container">
      {/* Header Section */}
      <div className="manage-jobs-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaBuilding className="title-icon" />
            Manage Jobs
          </h1>
          <p className="page-subtitle">
            Manage and track your job postings
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{jobs.length}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{jobs.filter(job => job.status === 'approved').length}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="manage-jobs-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="approved">Active</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <div className="job-title-section">
                    <h3 className="job-title">{job.title}</h3>
                    <span className={`job-status ${job.status}`}>
                      {job.status === 'approved' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="job-card-body">
                  <div className="job-info">
                    <div className="info-item">
                      <FaBuilding className="info-icon" />
                      <span>{job.company}</span>
                    </div>
                    <div className="info-item">
                      <FaMapMarkerAlt className="info-icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="info-item">
                      <FaDollarSign className="info-icon" />
                      <span>{job.ctc}</span>
                    </div>
                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <span>{job.jobType}</span>
                    </div>
                  </div>

                  <div className="job-description">
                    <p>{job.description.substring(0, 120)}...</p>
                  </div>

                  <div className="job-skills">
                    {job.skills && job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {job.skills && job.skills.length > 3 && (
                      <span className="skill-tag more">+{job.skills.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="job-card-footer">
                  <div className="job-meta">
                    <span className="posted-date">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="job-actions">
                    <button className="action-btn view-btn" title="View Details">
                      <FaEye />
                    </button>
                    <button className="action-btn edit-btn" title="Edit Job">
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete Job"
                      onClick={() => handleDelete(job._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaBuilding />
            </div>
            <h3>No jobs found</h3>
            <p>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t posted any jobs yet. Create your first job posting to get started!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
