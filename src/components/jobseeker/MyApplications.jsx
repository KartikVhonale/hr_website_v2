import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaFilter,
  FaSort,
  FaDownload,
  FaEdit
} from 'react-icons/fa';

const MyApplications = ({ applications, setApplications }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Mock applications data - in real app this would come from API
  const mockApplications = [
    {
      _id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      appliedAt: '2024-01-20',
      status: 'pending',
      salary: '$90,000 - $120,000',
      applicationMethod: 'Company Website',
      coverLetter: 'Dear Hiring Manager, I am excited to apply...',
      resume: 'john_doe_resume.pdf',
      notes: 'Follow up in 1 week',
      nextStep: 'Waiting for initial review'
    },
    {
      _id: '2',
      jobTitle: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      appliedAt: '2024-01-18',
      status: 'interview',
      salary: '$70,000 - $90,000',
      applicationMethod: 'LinkedIn',
      coverLetter: 'I am passionate about creating user-centered designs...',
      resume: 'john_doe_resume.pdf',
      notes: 'Interview scheduled for Friday',
      nextStep: 'Phone interview on Jan 25th',
      interviewDate: '2024-01-25'
    },
    {
      _id: '3',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      appliedAt: '2024-01-15',
      status: 'rejected',
      salary: '$85,000 - $110,000',
      applicationMethod: 'Job Board',
      coverLetter: 'With my background in product development...',
      resume: 'john_doe_resume.pdf',
      notes: 'Good learning experience',
      nextStep: 'Position filled',
      rejectionReason: 'Position filled with internal candidate'
    },
    {
      _id: '4',
      jobTitle: 'Full Stack Developer',
      company: 'InnovateTech',
      location: 'Seattle, WA',
      appliedAt: '2024-01-22',
      status: 'approved',
      salary: '$95,000 - $125,000',
      applicationMethod: 'Company Website',
      coverLetter: 'I am thrilled to apply for this position...',
      resume: 'john_doe_resume.pdf',
      notes: 'Great company culture',
      nextStep: 'Waiting for offer details',
      offerExpected: '2024-01-30'
    }
  ];

  const [displayApplications, setDisplayApplications] = useState(mockApplications);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'interview':
        return <FaCalendarAlt className="status-icon interview" />;
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'rejected':
        return <FaTimes className="status-icon rejected" />;
      default:
        return <FaFileAlt className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'interview':
        return '#3b82f6';
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const sortApplications = (apps, sortBy) => {
    const sorted = [...apps];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      case 'company':
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case 'title':
        return sorted.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
      default:
        return sorted;
    }
  };

  const filterApplications = (apps, filterBy) => {
    switch (filterBy) {
      case 'pending':
        return apps.filter(app => app.status === 'pending');
      case 'interview':
        return apps.filter(app => app.status === 'interview');
      case 'approved':
        return apps.filter(app => app.status === 'approved');
      case 'rejected':
        return apps.filter(app => app.status === 'rejected');
      default:
        return apps;
    }
  };

  const filteredAndSortedApplications = sortApplications(filterApplications(displayApplications, filterBy), sortBy);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleWithdrawApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      setDisplayApplications(displayApplications.filter(app => app._id !== applicationId));
    }
  };

  const ApplicationModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="application-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{application.jobTitle}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="modal-content">
            <div className="application-details">
              <div className="detail-section">
                <h4>Job Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Company</label>
                    <span>{application.company}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <span>{application.location}</span>
                  </div>
                  <div className="detail-item">
                    <label>Salary</label>
                    <span>{application.salary}</span>
                  </div>
                  <div className="detail-item">
                    <label>Applied Via</label>
                    <span>{application.applicationMethod}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Application Status</h4>
                <div className="status-info">
                  {getStatusIcon(application.status)}
                  <span className="status-text" style={{ color: getStatusColor(application.status) }}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <span className="applied-date">
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="next-step">{application.nextStep}</p>
              </div>

              <div className="detail-section">
                <h4>Documents</h4>
                <div className="documents">
                  <div className="document-item">
                    <FaFileAlt />
                    <span>{application.resume}</span>
                    <button className="download-btn">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Cover Letter</h4>
                <div className="cover-letter">
                  <p>{application.coverLetter}</p>
                </div>
              </div>

              <div className="detail-section">
                <h4>Notes</h4>
                <div className="notes">
                  <p>{application.notes}</p>
                  <button className="edit-notes-btn">
                    <FaEdit /> Edit Notes
                  </button>
                </div>
              </div>
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
            <span className="stat-number">{displayApplications.length}</span>
            <span className="stat-label">Total Applications</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{displayApplications.filter(app => app.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{displayApplications.filter(app => app.status === 'interview').length}</span>
            <span className="stat-label">Interviews</span>
          </div>
        </div>
      </div>

      <div className="applications-controls">
        <div className="filter-group">
          <FaFilter className="control-icon" />
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="control-select"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
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
            <option value="company">Company</option>
            <option value="status">Status</option>
            <option value="title">Job Title</option>
          </select>
        </div>
      </div>

      <div className="applications-list">
        {filteredAndSortedApplications.length > 0 ? (
          filteredAndSortedApplications.map((application) => (
            <div key={application._id} className={`application-card ${application.status}`}>
              <div className="application-header">
                <div className="job-info">
                  <h4 className="job-title">{application.jobTitle}</h4>
                  <div className="company-info">
                    <FaBuilding className="company-icon" />
                    <span className="company-name">{application.company}</span>
                    <FaMapMarkerAlt className="location-icon" />
                    <span className="location">{application.location}</span>
                  </div>
                </div>
                <div className="application-status">
                  {getStatusIcon(application.status)}
                  <span className="status-text" style={{ color: getStatusColor(application.status) }}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="application-content">
                <div className="application-details">
                  <span className="applied-date">
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                  <span className="salary">{application.salary}</span>
                  <span className="method">via {application.applicationMethod}</span>
                </div>
                <p className="next-step">{application.nextStep}</p>
                
                {application.interviewDate && (
                  <div className="interview-info">
                    <FaCalendarAlt />
                    <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="application-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewDetails(application)}
                >
                  <FaEye />
                  View Details
                </button>
                {application.status === 'pending' && (
                  <button 
                    className="action-btn withdraw-btn"
                    onClick={() => handleWithdrawApplication(application._id)}
                  >
                    <FaTimes />
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
              {filterBy === 'all' 
                ? "You haven't applied to any jobs yet. Start your job search today!"
                : `No applications found with "${filterBy}" status.`
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
