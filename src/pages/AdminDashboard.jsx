import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EditUserModal from '../components/EditUserModal';
import UserManagement from '../components/admin/UserManagement';
import JobManagement from '../components/admin/JobManagement';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import ArticleManagement from '../components/admin/ArticleManagement';
import ContactManagement from '../components/admin/ContactManagement';
import TeamManagement from '../components/admin/TeamManagement';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';
import { FaEdit, FaTrash, FaKey, FaEye, FaCheck, FaTimes, FaStar, FaUser, FaSearch, FaSyncAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Controllers
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('all');
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  if (loading || authLoading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-container">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title" style={{ marginBottom: 32 }}>Admin Dashboard</h1>

      <UserManagement
        users={users}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        handleResetPassword={handleResetPassword}
        onAuthorizeUser={handleAuthorizeUser}
      />
      <hr style={{ border: 'none', borderTop: '1.5px solid #e0e7ef', margin: '2.5rem 0' }} />

      <JobManagement jobs={jobs} />
      <hr style={{ border: 'none', borderTop: '1.5px solid #e0e7ef', margin: '2.5rem 0' }} />

      <ApplicationManagement applications={applications} />
      <hr style={{ border: 'none', borderTop: '1.5px solid #e0e7ef', margin: '2.5rem 0' }} />

      <ArticleManagement articles={articles} setArticles={setArticles} />
      <hr style={{ border: 'none', borderTop: '1.5px solid #e0e7ef', margin: '2.5rem 0' }} />

      <ContactManagement contacts={contacts} setContacts={setContacts} />
      <hr style={{ border: 'none', borderTop: '1.5px solid #e0e7ef', margin: '2.5rem 0' }} />

      <TeamManagement team={team} />

      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
