import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import userPreferences from '../../utils/userPreferences.js';
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
import { employerAPI, activityAPI } from '../../api/index.js';

const EmployerDashboard = ({ userData }) => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const user = userData;
  const [activeSection, setActiveSection] = useState(() => {
    // Load active section from cookie preferences
    return userPreferences.getActiveSection();
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);

  const [interviews, setInterviews] = useState([]);
  const [articles, setArticles] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [jobRefetchTrigger, setJobRefetchTrigger] = useState(0);
  
  // Mobile state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle navigation state from job creation
  useEffect(() => {
    if (location.state) {
      const { activeTab, successMessage: navSuccessMessage, newJobId } = location.state;

      if (activeTab) {
        setActiveSection(activeTab);
        // Save to cookie preferences
        userPreferences.setActiveSection(activeTab);
      }

      if (navSuccessMessage) {
        setSuccessMessage(navSuccessMessage);
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }

      // If a new job was created, refresh the jobs list
      if (newJobId) {
        fetchData(); // Refetch all dashboard data
        setJobRefetchTrigger(Date.now()); // Trigger refetch in ManageJobs
      }

      // Clear the navigation state to prevent re-triggering
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Save active section to cookies when it changes
  useEffect(() => {
    userPreferences.setActiveSection(activeSection);
  }, [activeSection]);

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

      // OPTIMIZED: Single API call to get all dashboard data
      const response = await employerAPI.getDashboardData();

      console.log('Dashboard API response:', response);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else {
        throw new Error('Invalid API response structure');
      }

      if (apiResponse.success) {
        const dashboardData = apiResponse.data || {};
        const {
          stats = {},
          recentJobs = [],
          recentApplications = [],
          savedCandidates = [],
          recentArticles = []
        } = dashboardData;

        // Update all state with single response
        setJobs(Array.isArray(recentJobs) ? recentJobs : []);
        setApplications(Array.isArray(recentApplications) ? recentApplications : []);
        setSavedCandidates(Array.isArray(savedCandidates) ? savedCandidates : []);
        setArticles(Array.isArray(recentArticles) ? recentArticles : []);

        // Store stats for overview section
        setDashboardStats({
          totalJobs: stats.totalJobs || 0,
          activeJobs: stats.activeJobs || 0,
          pendingJobs: stats.pendingJobs || 0,
          totalApplications: stats.totalApplications || 0,
          savedCandidates: stats.savedCandidates || 0,
          recentApplications: stats.recentApplications || 0
        });

        console.log('Dashboard data loaded successfully:', stats);
      } else {
        throw new Error(apiResponse.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(`Failed to load dashboard data: ${err.message}`);

      // Set default empty states on error
      setJobs([]);
      setApplications([]);
      setSavedCandidates([]);
      setArticles([]);
      setDashboardStats({
        totalJobs: 0,
        activeJobs: 0,
        pendingJobs: 0,
        totalApplications: 0,
        savedCandidates: 0,
        recentApplications: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await employerAPI.getPostedJobs();

      console.log('Jobs API response:', response);

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
        console.log('Jobs loaded successfully:', jobsData.length);
      } else {
        console.warn('API response indicates failure:', apiResponse);
        setJobs([]);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setJobs([]);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await employerAPI.updateApplicationStatus(applicationId, newStatus);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else {
        apiResponse = { success: true }; // Assume success if no clear structure
      }

      if (apiResponse.success !== false) {
        // Update local state immediately for better UX
        setApplications(applications.map(app =>
          app._id === applicationId
            ? { ...app, status: newStatus }
            : app
        ));
        console.log('Application status updated successfully');

        // Optionally refetch to ensure data consistency
        await fetchData();
      } else {
        throw new Error(apiResponse.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(`Failed to update status: ${err.message}`);
    }
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
    // Use dashboardStats if available, otherwise calculate from local data
    const stats = {
      activeJobs: dashboardStats.activeJobs || (Array.isArray(jobs) ? jobs.filter(job => job.status === 'approved').length : 0),
      totalApplications: dashboardStats.totalApplications || (Array.isArray(applications) ? applications.length : 0),
      pendingApplications: dashboardStats.recentApplications || (Array.isArray(applications) ? applications.filter(app => app.status === 'pending').length : 0),
      scheduledInterviews: Array.isArray(interviews) ? interviews.filter(interview => interview.status === 'scheduled').length : 0,
      totalJobs: dashboardStats.totalJobs || (Array.isArray(jobs) ? jobs.length : 0),
      savedCandidates: dashboardStats.savedCandidates || (Array.isArray(savedCandidates) ? savedCandidates.length : 0)
    };

    if (loading) {
      return (
        <div className="employer-overview">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="employer-overview">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Failed to load dashboard</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchData}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="employer-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon jobs">
              <FaBriefcase />
            </div>
            <div className="card-content">
              <h3>Active Jobs</h3>
              <p className="card-number">{stats.activeJobs}</p>
              <span className="card-label">Job postings</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon applications">
              <FaUsers />
            </div>
            <div className="card-content">
              <h3>Total Applications</h3>
              <p className="card-number">{stats.totalApplications}</p>
              <span className="card-label">Received applications</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon pending">
              <FaClock />
            </div>
            <div className="card-content">
              <h3>Pending Review</h3>
              <p className="card-number">{stats.pendingApplications}</p>
              <span className="card-label">Awaiting review</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon interviews">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h3>Saved Candidates</h3>
              <p className="card-number">{stats.savedCandidates}</p>
              <span className="card-label">In your list</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="recent-applications">
            <h3>Recent Applications</h3>
            <div className="application-list">
              {Array.isArray(applications) && applications.length > 0 ? (
                applications.slice(0, 5).map((app, index) => (
                  <div key={app._id || index} className="application-item">
                    <div className="applicant-info">
                      <span className="applicant-name">
                        {app.applicant?.name || 'Unknown Applicant'}
                      </span>
                      <span className="job-title">
                        {app.job?.title || 'Unknown Job'}
                      </span>
                    </div>
                    <div className="application-status">
                      <span className={`status-badge ${app.status || 'pending'}`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No recent applications</p>
                </div>
              )}
            </div>
          </div>

          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Total Jobs</span>
                <span className="stat-value">{stats.totalJobs}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Applications</span>
                <span className="stat-value">{stats.totalApplications}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Articles</span>
                <span className="stat-value">{Array.isArray(articles) ? articles.length : 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Saved Candidates</span>
                <span className="stat-value">{stats.savedCandidates}</span>
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
      <ManageJobs refetchTrigger={jobRefetchTrigger} />
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
        {Array.isArray(applications) && applications.length > 0 ? (
          applications.map((app, index) => (
            <div key={app._id || index} className="application-card">
              <div className="application-header">
                <h4>{app.applicant?.name || 'Unknown Applicant'}</h4>
                <span className={`status-badge ${app.status || 'pending'}`}>
                  {app.status || 'Pending'}
                </span>
              </div>
              <p className="job-title">{app.job?.title || 'Unknown Job'}</p>
              <div className="application-actions">
                <button
                  className="btn-view"
                  onClick={() => console.log('View application:', app._id)}
                >
                  <FaEye /> View
                </button>
                <button
                  className="btn-approve"
                  onClick={() => handleStatusChange(app._id, 'approved')}
                >
                  <FaCheckCircle /> Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleStatusChange(app._id, 'rejected')}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaUsers />
            </div>
            <h3>No Applications Yet</h3>
            <p>Applications will appear here once candidates start applying to your jobs.</p>
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
          {successMessage && (
            <div className="success-alert" style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #c3e6cb',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaCheckCircle />
              <span>{successMessage}</span>
            </div>
          )}
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
