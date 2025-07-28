import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmployerSidebar from './EmployerSidebar';
import CreateJob from './CreateJob';
import ManageJobs from './ManageJobs';
import ArticleManagement from './ArticleManagement';
import '../../css/EmployerDashboard.css';
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
  FaFileAlt
} from 'react-icons/fa';

const EmployerDashboard = ({ userData }) => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const user = userData;
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'employer' || user.status === 'disabled' || !user.isAuthorized) {
      setError('You do not have permission to view this page.');
      setLoading(false);
      return;
    }

    fetchData();
  }, [user, token, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchJobs(),
        fetchApplications(),
        fetchArticles()
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // Filter jobs by current employer
        const employerJobs = data.data.filter(job => job.employerId === user._id);
        setJobs(employerJobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
      const data = await response.json();
      if (data.success) {
        const userArticles = data.data.filter(article => article.author && article.author._id === user._id);
        setArticles(userArticles);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
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
                    <span className="applicant-name">John Doe</span>
                    <span className="job-title">Frontend Developer</span>
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
                <span className="stat-label">Profile Views</span>
                <span className="stat-value">1,234</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Job Views</span>
                <span className="stat-value">5,678</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Application Rate</span>
                <span className="stat-value">12.5%</span>
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
                <h4>John Doe</h4>
                <span className={`status-badge ${app.status || 'pending'}`}>
                  {app.status || 'Pending'}
                </span>
              </div>
              <p className="job-title">Frontend Developer</p>
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
            <h2>Candidate Database</h2>
            <p>Candidate management coming soon...</p>
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

  if (loading || authLoading) {
    return (
      <div className="employer-layout">
        <EmployerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="employer-content">
          <div className="dashboard-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employer-layout">
        <EmployerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="employer-content">
          <div className="dashboard-container">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="employer-layout">
      <EmployerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="employer-content">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Employer Dashboard</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
