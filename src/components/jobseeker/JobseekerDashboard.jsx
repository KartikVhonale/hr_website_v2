import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import JobseekerSidebar from './JobseekerSidebar';
import JobSearch from './JobSearch';
import SavedJobs from './SavedJobs';
import MyApplications from './MyApplications';
import InterviewSchedule from './InterviewSchedule';
import ProfileManagement from './ProfileManagement';
import ResumeBuilder from './ResumeBuilder';
import CareerInsights from './CareerInsights';
import NotificationCenter from './NotificationCenter';
import '../../css/JobseekerDashboard.css';
import { 
  FaSearch, 
  FaBookmark, 
  FaFileAlt, 
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaUser,
  FaChartLine,
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
  FaHeart
} from 'react-icons/fa';

const JobseekerDashboard = ({ userData }) => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const user = userData;
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'jobseeker' || user.status === 'disabled') {
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
        fetchSavedJobs(),
        fetchInterviews(),
        fetchNotifications()
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.data.filter(job => job.status === 'active'));
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
        // Filter applications by current user
        const userApplications = data.data.filter(app => app.applicantId === user._id);
        setApplications(userApplications);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      // This would be a separate endpoint for saved jobs
      setSavedJobs([]);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const fetchInterviews = async () => {
    try {
      // This would be a separate endpoint for interviews
      setInterviews([]);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      // This would be a separate endpoint for notifications
      setNotifications([]);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const renderOverview = () => {
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending').length;
    const interviewsScheduled = interviews.filter(interview => interview.status === 'scheduled').length;
    const savedJobsCount = savedJobs.length;

    return (
      <div className="jobseeker-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon applications">
              <FaFileAlt />
            </div>
            <div className="card-content">
              <h3>Applications</h3>
              <p className="card-number">{totalApplications}</p>
              <span className="card-label">Total submitted</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon pending">
              <FaClock />
            </div>
            <div className="card-content">
              <h3>Pending</h3>
              <p className="card-number">{pendingApplications}</p>
              <span className="card-label">Under review</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon interviews">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h3>Interviews</h3>
              <p className="card-number">{interviewsScheduled}</p>
              <span className="card-label">Scheduled</span>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-icon saved">
              <FaBookmark />
            </div>
            <div className="card-content">
              <h3>Saved Jobs</h3>
              <p className="card-number">{savedJobsCount}</p>
              <span className="card-label">Bookmarked</span>
            </div>
          </div>
        </div>

        <div className="overview-sections">
          <div className="recent-applications">
            <h3>Recent Applications</h3>
            {applications.length > 0 ? (
              <div className="applications-list">
                {applications.slice(0, 3).map((application) => (
                  <div key={application._id} className="application-item">
                    <div className="application-info">
                      <h4>{application.jobTitle}</h4>
                      <p>{application.company}</p>
                      <span className="application-date">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`application-status ${application.status}`}>
                      {application.status === 'pending' && <FaClock />}
                      {application.status === 'approved' && <FaCheckCircle />}
                      {application.status === 'rejected' && <FaTimes />}
                      <span>{application.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No applications yet. Start applying to jobs!</p>
                <button 
                  className="cta-button"
                  onClick={() => setActiveSection('job-search')}
                >
                  Find Jobs
                </button>
              </div>
            )}
          </div>

          <div className="job-recommendations">
            <h3>Recommended Jobs</h3>
            {jobs.length > 0 ? (
              <div className="jobs-list">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job._id} className="job-item">
                    <div className="job-info">
                      <h4>{job.title}</h4>
                      <p>{job.company}</p>
                      <span className="job-location">{job.location}</span>
                    </div>
                    <div className="job-actions">
                      <button className="save-job-btn">
                        <FaHeart />
                      </button>
                      <button className="apply-btn">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No job recommendations available.</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-completion">
          <h3>Profile Completion</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '75%' }}></div>
          </div>
          <p>75% Complete - Add more skills to improve your profile</p>
          <button 
            className="cta-button"
            onClick={() => setActiveSection('profile')}
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  };

  const renderJobSearch = () => (
    <JobSearch jobs={jobs} setJobs={setJobs} />
  );

  const renderSavedJobs = () => (
    <SavedJobs savedJobs={savedJobs} setSavedJobs={setSavedJobs} />
  );

  const renderApplications = () => (
    <MyApplications applications={applications} setApplications={setApplications} />
  );

  const renderInterviews = () => (
    <InterviewSchedule interviews={interviews} setInterviews={setInterviews} />
  );

  const renderProfile = () => (
    <ProfileManagement user={user} />
  );

  const renderResumeBuilder = () => (
    <ResumeBuilder user={user} />
  );

  const renderCareerInsights = () => (
    <CareerInsights />
  );

  const renderNotifications = () => (
    <NotificationCenter notifications={notifications} setNotifications={setNotifications} />
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'job-search':
        return renderJobSearch();
      case 'saved-jobs':
        return renderSavedJobs();
      case 'applications':
        return renderApplications();
      case 'interviews':
        return renderInterviews();
      case 'profile':
        return renderProfile();
      case 'resume':
        return renderResumeBuilder();
      case 'career-insights':
        return renderCareerInsights();
      case 'notifications':
        return renderNotifications();
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
      <div className="jobseeker-layout">
        <JobseekerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="jobseeker-content">
          <div className="dashboard-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobseeker-layout">
        <JobseekerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="jobseeker-content">
          <div className="dashboard-container">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobseeker-layout">
      <JobseekerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="jobseeker-content">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Career Dashboard</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default JobseekerDashboard;
