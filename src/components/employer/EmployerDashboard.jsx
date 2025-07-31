import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmployerSidebar from './EmployerSidebar';
import CreateJob from './CreateJob';
import ManageJobs from './ManageJobs';
import ArticleManagement from './ArticleManagement';
import '../../css/EmployerDashboard.css';
import '../../css/EmployerDashboard-responsive.css';
import { 
  FaBriefcase, 
  FaUsers, 
  FaChartBar, 
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaBuilding,
  FaFileAlt,
  FaUser,
  FaBookmark,
  FaBars,
  FaTimes as FaClose,
  FaBell,
  FaCog,
  FaHome,
  FaTachometerAlt
} from 'react-icons/fa';
import userService from '../../services/userService';

const EmployerDashboard = ({ userData }) => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const user = userData;
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [candidateStatus, setCandidateStatus] = useState({});
  const [candidateNotes, setCandidateNotes] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [articles, setArticles] = useState([]);
  
  // Mobile state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'employer' || user.status === 'disabled' || !user.isAuthorized) {
      setError('You do not have permission to view this page.');
      return;
    }

    fetchData();
  }, [user, authLoading, token]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // Use Promise.allSettled to handle individual failures gracefully
      const results = await Promise.allSettled([
        fetchJobs(),
        fetchApplications(),
        fetchArticles(),
        fetchSavedCandidates()
      ]);

      // Check for any rejected promises and log them
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some data failed to load:', failures);
        // Don't set error for partial failures, just log them
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/employer/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/employer/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/author/${user._id}`);
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  const fetchSavedCandidates = async () => {
    try {
      const data = await userService.getSavedCandidates(token);
      if (data && data.success) {
        setSavedCandidates(data.data || []);
        // Initialize status and notes state
        const statusMap = {};
        const notesMap = {};
        (data.data || []).forEach(candidate => {
          if (candidate && candidate._id) {
            statusMap[candidate._id] = candidate.status || 'new';
            notesMap[candidate._id] = candidate.notes || '';
          }
        });
        setCandidateStatus(statusMap);
        setCandidateNotes(notesMap);
      } else {
        setSavedCandidates([]);
        setCandidateStatus({});
        setCandidateNotes({});
      }
    } catch (err) {
      console.error('Failed to fetch saved candidates:', err);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      await userService.removeSavedCandidate(candidateId, token);
      setSavedCandidates(savedCandidates.filter(c => c._id !== candidateId));
    } catch (err) {
      console.error('Failed to remove candidate:', err);
    }
  };

  const handleStatusChange = (candidateId, status) => {
    setCandidateStatus(prev => ({
      ...prev,
      [candidateId]: status
    }));
    // Auto-save status change
    userService.updateCandidateStatus(candidateId, status, token)
      .catch(err => console.error('Failed to update status:', err));
  };

  const handleNotesChange = (candidateId, notes) => {
    setCandidateNotes(prev => ({
      ...prev,
      [candidateId]: notes
    }));
  };

  const handleSaveNotes = async (candidateId) => {
    try {
      await userService.updateCandidateNotes(
        candidateId, 
        candidateNotes[candidateId], 
        token
      );
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const renderOverview = () => {
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const scheduledInterviews = interviews.filter(interview => interview.status === 'scheduled').length;

    return (
      <div className="employer-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon jobs">
              <FaBriefcase />
            </div>
            <div className="card-content">
              <h3>Active Jobs</h3>
              <p className="card-number">{activeJobs}</p>
              <span className="card-label">Job postings</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon applications">
              <FaUsers />
            </div>
            <div className="card-content">
              <h3>Total Applications</h3>
              <p className="card-number">{totalApplications}</p>
              <span className="card-label">Received applications</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon pending">
              <FaClock />
            </div>
            <div className="card-content">
              <h3>Pending Review</h3>
              <p className="card-number">{pendingApplications}</p>
              <span className="card-label">Awaiting review</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon interviews">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h3>Scheduled Interviews</h3>
              <p className="card-number">{scheduledInterviews}</p>
              <span className="card-label">This week</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="recent-applications">
            <h3>Recent Applications</h3>
            <div className="application-list">
              {applications.slice(0, 5).map((app, index) => (
                <div key={index} className="application-item">
                  <div className="applicant-info">
                    <span className="applicant-name">{app.applicant.name}</span>
                    <span className="job-title">{app.job.title}</span>
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${app.status || 'pending'}`}>
                      {app.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Total Jobs</span>
                <span className="stat-value">{jobs.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Applications</span>
                <span className="stat-value">{applications.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Articles</span>
                <span className="stat-value">{articles.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobManagement = () => (
    <div className="job-management-section">
      <div className="section-header">
        <h2>Job Management</h2>
        <button 
          className="primary-btn"
          onClick={() => setActiveSection('create-job')}
        >
          <FaBriefcase />
          Post New Job
        </button>
      </div>
      <ManageJobs />
    </div>
  );

  const renderCreateJob = () => (
    <div className="create-job-section">
      <div className="section-header">
        <h2>Create New Job</h2>
        <button 
          className="secondary-btn"
          onClick={() => setActiveSection('jobs')}
        >
          Back to Jobs
        </button>
      </div>
      <CreateJob />
    </div>
  );

  const renderApplications = () => (
    <div className="applications-section">
      <h2>Job Applications</h2>
      <div className="applications-grid">
        {applications.length > 0 ? (
          applications.map((app, index) => (
            <div key={index} className="application-card">
              <div className="application-header">
                <h4>{app.applicant.name}</h4>
                <span className={`status-badge ${app.status || 'pending'}`}>
                  {app.status || 'Pending'}
                </span>
              </div>
              <p className="job-title">{app.job.title}</p>
              <div className="application-actions">
                <button className="btn-view">
                  <FaEye /> View
                </button>
                <button className="btn-approve">
                  <FaCheckCircle /> Approve
                </button>
                <button className="btn-reject">
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No applications received yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderArticleManagement = () => (
    <ArticleManagement articles={articles} setArticles={setArticles} />
  );

  const renderCompanyProfile = () => (
    <div className="company-profile-section">
      <h2>Company Profile</h2>
      <div className="profile-card">
        <div className="profile-header">
          <div className="company-logo">
            <FaBuilding />
          </div>
          <div className="company-info">
            <h3>{user.company || 'Your Company'}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <label>Company Name</label>
            <input type="text" value={user.company || ''} readOnly />
          </div>
          <div className="detail-item">
            <label>Email</label>
            <input type="email" value={user.email || ''} readOnly />
          </div>
          <div className="detail-item">
            <label>Industry</label>
            <input type="text" placeholder="Technology" />
          </div>
          <div className="detail-item">
            <label>Company Size</label>
            <select>
              <option>1-10 employees</option>
              <option>11-50 employees</option>
              <option>51-200 employees</option>
              <option>200+ employees</option>
            </select>
          </div>
        </div>
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'jobs':
        return renderJobManagement();
      case 'create-job':
        return renderCreateJob();
      case 'articles':
        return renderArticleManagement();
      case 'applications':
        return renderApplications();
      case 'candidates':
        return (
          <div className="candidates-section">
            <h2>Saved Candidates</h2>
            {savedCandidates.length > 0 ? (
              <div className="candidates-grid">
                {savedCandidates.map((candidate) => (
                  <div key={candidate._id} className="candidate-card">
                    <div className="candidate-header">
                      <div className="candidate-avatar">
                        <FaUser />
                      </div>
                      <div className="candidate-info">
                        <h4>{candidate.name}</h4>
                        <p>{candidate.jobTitle || 'Job Seeker'}</p>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveCandidate(candidate._id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="candidate-status">
                      <select
                        value={candidateStatus[candidate._id] || candidate.status}
                        onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="review">In Review</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="candidate-notes">
                      <textarea
                        placeholder="Add notes about this candidate..."
                        value={candidateNotes[candidate._id] || candidate.notes || ''}
                        onChange={(e) => handleNotesChange(candidate._id, e.target.value)}
                      />
                      <button 
                        className="save-btn"
                        onClick={() => handleSaveNotes(candidate._id)}
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaBookmark />
                <p>No saved candidates yet.</p>
              </div>
            )}
          </div>
        );
      case 'interviews':
        return (
          <div className="interviews-section">
            <h2>Interview Management</h2>
            <p>Interview scheduling coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="analytics-section">
            <h2>Hiring Analytics</h2>
            <p>Analytics dashboard coming soon...</p>
          </div>
        );
      case 'company':
        return renderCompanyProfile();
      case 'settings':
        return (
          <div className="settings-section">
            <h2>Account Settings</h2>
            <p>Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview': return 'Dashboard';
      case 'jobs': return 'Job Management';
      case 'applications': return 'Applications';
      case 'candidates': return 'Candidates';
      case 'interviews': return 'Interviews';
      case 'analytics': return 'Analytics';
      case 'articles': return 'Articles';
      case 'profile': return 'Company Profile';
      case 'create-job': return 'Create Job';
      default: return 'Dashboard';
    }
  };

  if (loading || authLoading) {
    return (
      <div className="employer-layout">
        {isMobile && (
          <>
            <div className="mobile-header">
              <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h1 className="mobile-title">Employer Dashboard</h1>
              <div className="mobile-header-actions">
                <button><FaBell /></button>
                <button><FaCog /></button>
              </div>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
          </>
        )}
        <EmployerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <div className="employer-content">
          <div className="dashboard-container">Loading...</div>
        </div>
        {isMobile && (
          <div className="mobile-bottom-nav">
            <div className="mobile-nav-items">
              <button 
                className={`mobile-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveSection('overview')}
              >
                <FaHome />
                <span>Home</span>
              </button>
              <button 
                className={`mobile-nav-item ${activeSection === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveSection('jobs')}
              >
                <FaBriefcase />
                <span>Jobs</span>
              </button>
              <button 
                className={`mobile-nav-item ${activeSection === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveSection('applications')}
              >
                <FaUsers />
                <span>Applications</span>
              </button>
              <button 
                className={`mobile-nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveSection('analytics')}
              >
                <FaChartBar />
                <span>Analytics</span>
              </button>
              <button 
                className={`mobile-nav-item ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveSection('profile')}
              >
                <FaBuilding />
                <span>Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="employer-layout">
        {isMobile && (
          <>
            <div className="mobile-header">
              <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <FaBars />
              </button>
              <h1 className="mobile-title">Employer Dashboard</h1>
              <div className="mobile-header-actions">
                <button><FaBell /></button>
                <button><FaCog /></button>
              </div>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
          </>
        )}
        <EmployerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <div className="employer-content">
          <div className="dashboard-container">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="employer-layout">
      {isMobile && (
        <>
          <div className="mobile-header">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h1 className="mobile-title">{getSectionTitle()}</h1>
            <div className="mobile-header-actions">
              <button><FaBell /></button>
              <button><FaCog /></button>
            </div>
          </div>
          {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </>
      )}
      <EmployerSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className="employer-content">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Employer Dashboard</h1>
          {renderContent()}
        </div>
      </div>
      {isMobile && (
        <div className="mobile-bottom-nav">
          <div className="mobile-nav-items">
            <button 
              className={`mobile-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <FaHome />
              <span>Home</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeSection === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveSection('jobs')}
            >
              <FaBriefcase />
              <span>Jobs</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeSection === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveSection('applications')}
            >
              <FaUsers />
              <span>Applications</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              <FaChartBar />
              <span>Analytics</span>
            </button>
            <button 
              className={`mobile-nav-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <FaBuilding />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
