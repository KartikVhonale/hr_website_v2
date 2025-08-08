import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaFilter,
  FaSort,
  FaSearch,
  FaBuilding,
  FaUser
} from 'react-icons/fa';
import { jobseekerAPI, applicationsAPI } from '../../api/index.js';
import '../../css/MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const res = await jobseekerAPI.getAppliedJobs();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch applied jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedApplications = applications
    .filter(app => {
      if (!searchTerm) return true;
      return app.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             app.job?.company.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(app => {
      if (filterBy === 'all') return true;
      return app.status === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.job?.title.localeCompare(b.job?.title);
        case 'company':
          return a.job?.company.name.localeCompare(b.job?.company.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge approved"><FaCheckCircle /> Approved</span>;
      case 'rejected':
        return <span className="status-badge rejected"><FaTimes /> Rejected</span>;
      case 'review':
        return <span className="status-badge review"><FaClock /> Under Review</span>;
      default:
        return <span className="status-badge pending"><FaClock /> Pending</span>;
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    setLoading(true);
    try {
      await updateApplicationStatus(applicationId, { status: 'withdrawn' });
      fetchAppliedJobs();
    } catch (err) {
      console.error('Failed to withdraw application:', err);
    } finally {
      setLoading(false);
    }
  };

  const ApplicationModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="application-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Application Details</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="modal-content">
            <div className="application-details">
              <div className="detail-section">
                <h4>Job Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Job Title</label>
                    <span>{application.job?.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Company</label>
                    <span>{application.job?.company.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <span>{application.job?.location}</span>
                  </div>
                  <div className="detail-item">
                    <label>Applied Date</label>
                    <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span>{getStatusBadge(application.status)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Application Status</h4>
                <div className="status-timeline">
                  <div className={`status-step ${application.status === 'applied' ? 'active' : ''}`}>
                    <div className="step-icon"><FaFileAlt /></div>
                    <div className="step-info">
                      <h5>Application Submitted</h5>
                      <p>{new Date(application.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`status-step ${application.status === 'review' ? 'active' : ''}`}>
                    <div className="step-icon"><FaEye /></div>
                    <div className="step-info">
                      <h5>Under Review</h5>
                      <p>{application.status === 'review' ? 'Currently reviewing your application' : ''}</p>
                    </div>
                  </div>
                  <div className={`status-step ${application.status === 'approved' || application.status === 'rejected' ? 'active' : ''}`}>
                    <div className="step-icon">
                      {application.status === 'approved' ? <FaCheckCircle /> : 
                       application.status === 'rejected' ? <FaTimes /> : <FaClock />}
                    </div>
                    <div className="step-info">
                      <h5>Decision</h5>
                      <p>
                        {application.status === 'approved' ? 'Congratulations! You have been selected for the next round.' :
                         application.status === 'rejected' ? 'Thank you for your interest. We have decided to move forward with other candidates.' :
                         'Awaiting decision'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {application.notes && (
                <div className="detail-section">
                  <h4>Employer Notes</h4>
                  <p className="notes-content">{application.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-applications-section">
      <div className="applications-header">
        <div className="header-content">
          <h2>My Applications</h2>
          <p>Track the status of your job applications</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{applications.length}</span>
            <span className="stat-label">Total Applications</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{applications.filter(a => a.status === 'pending' || a.status === 'review').length}</span>
            <span className="stat-label">Under Review</span>
          </div>
        </div>
      </div>

      <div className="applications-controls">
        <div className="search-group">
          <FaSearch className="control-icon" />
          <input
            type="text"
            placeholder="Search applications..."
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
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="sort-group">
          <FaSort className="control-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="control-select"
          >
            <option value="date">Application Date</option>
            <option value="title">Job Title</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="applications-list">
        {filteredAndSortedApplications.length > 0 ? (
          filteredAndSortedApplications.map((application) => (
            <div key={application._id} className={`application-card ${application.status}`}>
              <div className="application-header">
                <div className="job-info">
                  <div className="company-logo">
                    <FaBuilding />
                  </div>
                  <div className="job-details">
                    <h4 className="job-title">{application.job?.title}</h4>
                    <p className="company-name">{application.job?.company.name}</p>
                  </div>
                </div>
                <div className="application-meta">
                  {getStatusBadge(application.status)}
                  <span className="application-date">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="application-content">
                <div className="application-details">
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <span>{application.applicant?.name}</span>
                  </div>
                  <div className="detail-item">
                    <FaBuilding className="detail-icon" />
                    <span>{application.job?.location}</span>
                  </div>
                </div>
                
                <p className="application-notes">
                  {application.notes?.substring(0, 100)}...
                </p>
              </div>

              <div className="application-actions">
                <Link to={`/application-status/${application._id}`} className="action-btn view-btn">
                  <FaEye /> View Status
                </Link>
                {(application.status === 'pending' || application.status === 'review') && (
                  <button 
                    className="action-btn withdraw-btn"
                    onClick={() => handleWithdrawApplication(application._id)}
                    disabled={loading}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-applications">
            <div className="empty-icon">
              <FaFileAlt />
            </div>
            <h3>No applications found</h3>
            <p>
              {searchTerm || filterBy !== 'all'
                ? "No applications match your search criteria."
                : "You haven't submitted any job applications yet."
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

      {selectedApplication && (
        <ApplicationModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
      )}
    </div>
  );
};

export default MyApplications;
