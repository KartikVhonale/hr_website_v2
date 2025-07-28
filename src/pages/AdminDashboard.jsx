import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditUserModal from '../components/modal/EditUserModal';
import AddUserModal from '../components/modal/AddUserModal';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import JobManagement from '../components/admin/JobManagement';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import ArticleManagement from '../components/admin/ArticleManagement';
import ContactManagement from '../components/admin/ContactManagement';
import TeamManagement from '../components/admin/TeamManagement';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';
import '../css/AdminDashboard-responsive.css';
import { FaEdit, FaTrash, FaKey, FaEye, FaCheck, FaTimes, FaStar, FaUser, FaSearch, FaSyncAlt, FaChartBar, FaUsers, FaBriefcase, FaBars, FaTimes as FaClose, FaTachometerAlt, FaClipboardList, FaFileAlt, FaEnvelope, FaUserFriends, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [activities, setActivities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Controllers
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('all');
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Handle window resize for responsive design
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchUsers = async () => {
      if (!token) {
        setLoading(false);
        setError('You are not authorized to view this page.');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }

        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, authLoading]);

  // Filtered data
  const filteredUsers = users.filter(u =>
    (userRole === 'all' || u.role === userRole) &&
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch jobs');
        }

        setJobs(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, [token]);

  const filteredJobs = jobs.filter(j =>
    (jobStatus === 'all' || j.status === jobStatus) &&
    (j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.company.toLowerCase().includes(jobSearch.toLowerCase()))
  );
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch applications');
        }

        setApplications(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplications();
  }, [token]);

  const filteredApplications = applications.filter(a =>
    (appStatus === 'all' || a.status === appStatus) &&
    (a.job.title.toLowerCase().includes(appSearch.toLowerCase()) || a.applicant.name.toLowerCase().includes(appSearch.toLowerCase()))
  );
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch articles');
        }

        setArticles(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArticles();
  }, [token]);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch contacts');
        }

        setContacts(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContacts();
  }, [token]);

  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/team`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch team');
        }

        setTeam(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeam();
  }, [token]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activity`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch activities');
        }

        setActivities(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchActivities();
  }, [token]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete user');
        }

        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password');
    if (newPassword) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}/reset-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }

        alert('Password reset successfully');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAuthorizeUser = async (userId, isAuthorized) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}/authorize`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isAuthorized }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update authorization status');
      }

      setUsers(users.map(user => user._id === userId ? { ...user, isAuthorized } : user));
      alert(`Employer authorization status updated successfully`);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon users">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Total Users</h3>
            <p className="card-number">{users.length}</p>
            <span className="card-label">Registered users</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon jobs">
            <FaBriefcase />
          </div>
          <div className="card-content">
            <h3>Active Jobs</h3>
            <p className="card-number">{jobs.filter(job => job.status === 'active').length}</p>
            <span className="card-label">Job postings</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon applications">
            <FaChartBar />
          </div>
          <div className="card-content">
            <h3>Applications</h3>
            <p className="card-number">{applications.length}</p>
            <span className="card-label">Total applications</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="card-icon articles">
            <FaEdit />
          </div>
          <div className="card-content">
            <h3>Articles</h3>
            <p className="card-number">{articles.length}</p>
            <span className="card-label">Published articles</span>
          </div>
        </div>
      </div>
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div className="activity-item" key={index}>
                <span className="activity-time">{formatTimeAgo(activity.date)}</span>
                <span className="activity-text">{activity.type}: <strong>{activity.details}</strong></span>
              </div>
            ))
          ) : (
            <p>No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return (
          <UserManagement
            users={users}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            handleResetPassword={handleResetPassword}
            onAuthorizeUser={handleAuthorizeUser}
            onAddUser={() => setIsAddModalOpen(true)}
          />
        );
      case 'jobs':
        return <JobManagement jobs={jobs} />;
      case 'applications':
        return <ApplicationManagement applications={applications} />;
      case 'articles':
        return <ArticleManagement articles={articles} setArticles={setArticles} />;
      case 'contacts':
        return <ContactManagement contacts={contacts} setContacts={setContacts} />;
      case 'team':
        return <TeamManagement team={team} />;
      case 'settings':
        return (
          <div className="settings-section">
            <h2>System Settings</h2>
            <p>Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (loading || authLoading) {
    return (
      <div className="admin-layout">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className={`admin-content ${isMobile && isSidebarOpen ? 'sidebar-open' : ''}`}>
          {isMobile && (
            <div className="mobile-header">
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <FaClose /> : <FaBars />}
              </button>
              <h1 className="mobile-title">Admin Dashboard</h1>
            </div>
          )}
          <div className="dashboard-container">Loading...</div>
        </div>
        {isMobile && isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className={`admin-content ${isMobile && isSidebarOpen ? 'sidebar-open' : ''}`}>
          {isMobile && (
            <div className="mobile-header">
              <button 
                className="mobile-menu-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <FaClose /> : <FaBars />}
              </button>
              <h1 className="mobile-title">Admin Dashboard</h1>
            </div>
          )}
          <div className="dashboard-container">{error}</div>
        </div>
        {isMobile && isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={(section) => {
          setActiveSection(section);
          if (isMobile) {
            setIsSidebarOpen(false); // Close sidebar on mobile after selection
          }
        }}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`admin-content ${isMobile && isSidebarOpen ? 'sidebar-open' : ''}`}>
        {isMobile && (
          <div className="mobile-header">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Open navigation menu"
            >
              {isSidebarOpen ? <FaClose /> : <FaBars />}
            </button>
            <h1 className="mobile-title">Admin Dashboard</h1>
            <div className="mobile-header-actions">
              <span className="current-section">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
            </div>
          </div>
        )}
        <div className="dashboard-container">
          {!isMobile && <h1 className="dashboard-title">Admin Dashboard</h1>}
          {renderContent()}
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <FaTachometerAlt />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaUsers />
            <span>Users</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveSection('jobs')}
          >
            <FaBriefcase />
            <span>Jobs</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveSection('applications')}
          >
            <FaClipboardList />
            <span>Apps</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveSection('articles')}
          >
            <FaFileAlt />
            <span>Articles</span>
          </button>
          <button 
            className={`nav-item ${isSidebarOpen ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Close menu" : "More options"}
          >
            {isSidebarOpen ? <FaClose /> : <FaBars />}
            <span>More</span>
          </button>
        </div>
      )}
      
      {/* Overlay for mobile sidebar - only show on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
          style={{ display: 'block' }}
        />
      )}
      
      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      <AddUserModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AdminDashboard;
