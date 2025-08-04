import React, { useState, useEffect } from 'react';
import { employerAPI, jobsAPI } from '../../api/index.js';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaBuilding,
  FaRupeeSign,
  FaClock,
  FaUsers,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaBriefcase
} from 'react-icons/fa';
import '../../css/ManageJobs.css';
import { useNavigate } from 'react-router-dom';
import EditJobModal from '../modal/EditJobModal.jsx';

const ManageJobs = ({ refetchTrigger }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const handleOpenEdit = (job) => {
    setSelectedJob(job);
    setIsEditOpen(true);
  };
  const handleCloseEdit = () => {
    setSelectedJob(null);
    setIsEditOpen(false);
  };
  const handleJobUpdated = (updatedJob) => {
    setJobs(prev => prev.map(j => j._id === updatedJob._id ? updatedJob : j));
  };

  useEffect(() => {
    // Fetch jobs on mount and when the refetch trigger changes
    if (refetchTrigger > 0) {
      fetchJobs(true); // Force refetch, bypassing cache
    } else {
      fetchJobs(false); // Fetch from cache on initial load
    }
  }, [refetchTrigger]);

  const fetchJobs = async (forceRefetch = false) => {
    setLoading(true);
    try {
      // Pass forceRefetch to the API call
      const response = await employerAPI.getPostedJobs(forceRefetch);

      console.log('ManageJobs API response:', response);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else {
        throw new Error('Invalid API response structure');
      }

      if (apiResponse && apiResponse.success) {
        const jobsData = apiResponse.data || [];
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        console.log('ManageJobs: Jobs loaded successfully:', jobsData.length);
      } else {
        console.warn('ManageJobs: API response indicates failure:', apiResponse);
        setJobs([]);
      }
    } catch (error) {
      console.error('ManageJobs: Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setLoading(true);
      try {
        console.log(`Attempting to delete job with ID: ${jobId}`);
        const response = await jobsAPI.deleteJob(jobId);
        console.log('Delete job API response:', response);
        // Refresh the job list after successful deletion
        fetchJobs();
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
        // Optionally, show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };
// View and Edit action handlers
  const handleView = (jobId) => {
    navigate(`/job/${jobId}`);
  };
  const handleEdit = (jobId) => {
    window.alert(`Edit job ${jobId}`);
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
            <div className="stat-number">{Array.isArray(jobs) ? jobs.length : 0}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Array.isArray(jobs) ? jobs.filter(job => job.status === 'approved').length : 0}
            </div>
            <div className="stat-label">Active</div>
          </div>
        </div>
      </div>
                {/* Edit Job Modal */}
                {selectedJob && (
                  <EditJobModal
                    isOpen={isEditOpen}
                    onRequestClose={handleCloseEdit}
                    job={selectedJob}
                    onJobUpdated={handleJobUpdated}
                  />
                )}

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
                      <FaRupeeSign className="info-icon" />
                      <span className="ctc-display">
                        {job.ctc ? `${job.ctc} LPA` : 'Not specified'}
                      </span>
                    </div>
                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <span>{job.jobType}</span>
                    </div>
                  </div>

                  <div className="job-description">
                    <p>{job.description ? job.description.substring(0, 100) + '...' : 'No description available'}</p>
                  </div>

                  <div className="job-skills">
                    {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
                      <>
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="skill-tag more">+{job.skills.length - 3} more</span>
                        )}
                      </>
                    ) : (
                      <span className="skill-tag">No skills specified</span>
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
                    <button className="action-btn view-btn" title="View Details" onClick={() => handleView(job._id)}>
                      <FaEye />
                    </button>
                    <button className="action-btn edit-btn" title="Edit Job" onClick={() => handleOpenEdit(job)}>
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
