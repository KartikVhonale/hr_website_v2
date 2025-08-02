import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import userPreferences from '../../utils/userPreferences.js';
import JobseekerSidebar from './JobseekerSidebar';
import JobSearch from './JobSearch';
import SavedJobs from './SavedJobs';
import MyApplications from './MyApplications';
import InterviewSchedule from './InterviewSchedule';
import ProfileManagement from './ProfileManagement/ProfileManagement';
import ResumeBuilder from './ResumeBuilder';
import CareerInsights from './CareerInsights';
import NotificationCenter from './NotificationCenter';
import { jobseekerAPI, jobsAPI, notificationsAPI } from '../../api/index.js';
import '../../css/JobseekerDashboard.css';
import '../../css/JobseekerDashboard-responsive.css';
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
  FaHeart,
  FaBars,
  FaTimes as FaClose,
  FaBell,
  FaCog,
  FaHome
} from 'react-icons/fa';

const JobseekerDashboard = ({ userData }) => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const user = userData;
  const [activeSection, setActiveSection] = useState(() => {
    // Load active section from cookie preferences
    return userPreferences.getActiveSection();
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'jobseeker' || user.status === 'disabled') {
      setError('You do not have permission to view this page.');
      setLoading(false);
      return;
    }

    fetchData();
    
    // Handle window resize for responsive design
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false); // Close sidebar on desktop
      }
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, token, authLoading]);

  // Save active section to cookies when it changes
  useEffect(() => {
    userPreferences.setActiveSection(activeSection);
  }, [activeSection]);

  // Auto-refresh notifications every 10 minutes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;

      try {
        const response = await jobseekerAPI.getNotifications();
        const apiResponse = response.data;
        if (apiResponse.success) {
          setNotifications(apiResponse.data || []);
          console.log('Notifications refreshed:', new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err.message);
        // Don't set error for notification fetch failures to avoid disrupting the dashboard
      }
    };

    // Initial fetch is handled by fetchData, so we only set up the interval
    const notificationRefreshInterval = setInterval(() => {
      console.log('Auto-refreshing notifications...');
      fetchNotifications();
    }, 10 * 60 * 1000); // 10 minutes

    // Cleanup interval on component unmount
    return () => {
      clearInterval(notificationRefreshInterval);
    };
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      // OPTIMIZED: Single API call to get all dashboard data
      const response = await jobseekerAPI.getDashboardData();

      // The response structure is { data: { success: true, data: {...}, message: '...' } }
      const apiResponse = response.data;

      if (apiResponse.success) {
        const {
          profile,
          stats,
          recentApplications,
          savedJobs: savedJobsData,
          jobRecommendations,
          upcomingInterviews,
          notifications: notificationsData
        } = apiResponse.data;

        // Update all state with single response
        setJobs(jobRecommendations || []);
        setSavedJobs(savedJobsData || []);
        setApplications(recentApplications || []);
        setInterviews(upcomingInterviews || []);
        setNotifications(notificationsData || []);

        // Store stats for overview section
        setDashboardStats(stats);

        console.log('Jobseeker dashboard data loaded successfully:', stats);
      } else {
        throw new Error(apiResponse.message || 'Failed to load dashboard data');
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
      const data = await jobsAPI.getAllJobs({ status: 'active' });
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await jobseekerAPI.getAppliedJobs();
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await jobseekerAPI.getSavedJobs();
      setSavedJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await jobseekerAPI.getInterviewSchedule();
      setInterviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
      setInterviews([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationsAPI.getUserNotifications({ limit: 10 });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      const data = await jobseekerService.unsaveJob(jobId, token);
      if (data.success) {
        setSavedJobs(savedJobs.filter(job => job._id !== jobId));
      }
    } catch (err) {
      console.error('Failed to unsave job:', err);
    }
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading || authLoading) {
    return (
      <div className="jobseeker-layout">
        <JobseekerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          isMobile={isMobile} 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
        />
        <div className="jobseeker-content">
          <div className="dashboard-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobseeker-layout">
        <JobseekerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          isMobile={isMobile} 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
        />
        <div className="jobseeker-content">
          <div className="dashboard-container">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobseeker-layout">
      {/* Sidebar overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <JobseekerSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <div className="jobseeker-content">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mobile-header">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              {isSidebarOpen ? <FaClose /> : <FaBars />}
            </button>
            <h1 className="mobile-title">Jobseeker Dashboard</h1>
            <div className="mobile-header-actions">
              <span className="current-section">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
            </div>
          </div>
        )}
        
        <div className="dashboard-container">
          {!isMobile && <h1 className="dashboard-title">Jobseeker Dashboard</h1>}
          {activeSection === 'overview' && (
            <div className="jobseeker-overview">
              <div className="overview-cards">
                <div className="overview-card">
                  <div className="card-icon applications">
                    <FaFileAlt />
                  </div>
                  <div className="card-content">
                    <h3>Applications</h3>
                    <p className="card-number">{applications.length}</p>
                    <span className="card-label">Total submitted</span>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="card-icon pending">
                    <FaClock />
                  </div>
                  <div className="card-content">
                    <h3>Pending</h3>
                    <p className="card-number">{applications.filter(app => app.status === 'pending').length}</p>
                    <span className="card-label">Under review</span>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="card-icon interviews">
                    <FaCalendarAlt />
                  </div>
                  <div className="card-content">
                    <h3>Interviews</h3>
                    <p className="card-number">{interviews.filter(interview => interview.status === 'scheduled').length}</p>
                    <span className="card-label">Scheduled</span>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="card-icon saved">
                    <FaBookmark />
                  </div>
                  <div className="card-content">
                    <h3>Saved Jobs</h3>
                    <p className="card-number">{savedJobs.length}</p>
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
                            <h4>{application.job?.title}</h4>
                            <p>{application.job?.company}</p>
                            <span className="application-date">
                              Applied on {new Date(application.createdAt).toLocaleDateString()}
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
                  <h3>Recommended Jobs For You</h3>
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
                <h3>Profile Completion Status</h3>
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
          )}
          {activeSection === 'job-search' && <JobSearch jobs={jobs} setJobs={setJobs} token={token} />}
          {activeSection === 'saved-jobs' && <SavedJobs savedJobs={savedJobs} setSavedJobs={setSavedJobs} token={token} onUnsaveJob={handleUnsaveJob} />}
          {activeSection === 'applications' && <MyApplications applications={applications} setApplications={setApplications} token={token} />}
          {activeSection === 'interviews' && <InterviewSchedule interviews={interviews} setInterviews={setInterviews} />}
          {activeSection === 'profile' && <ProfileManagement user={user} />}
          {activeSection === 'resume' && <ResumeBuilder user={user} />}
          {activeSection === 'career-insights' && <CareerInsights />}
          {activeSection === 'notifications' && <NotificationCenter notifications={notifications} setNotifications={setNotifications} />}
          {activeSection === 'settings' && (
            <div className="settings-section">
              <h2>Account & Privacy Settings</h2>
              <p>Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <FaHome />
            <span>Home</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'job-search' ? 'active' : ''}`}
            onClick={() => setActiveSection('job-search')}
          >
            <FaSearch />
            <span>Jobs</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveSection('applications')}
          >
            <FaFileAlt />
            <span>Apps</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <FaUser />
            <span>Profile</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <FaBell />
            <span>Alerts</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobseekerDashboard;
