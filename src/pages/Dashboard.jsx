import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployerDashboard from '../components/employer/EmployerDashboard';
import JobseekerDashboard from '../components/jobseeker/JobseekerDashboard';
import '../css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        setError('You are not logged in.');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile');
        }

        setUserData(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, authLoading]);


  if (loading || authLoading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-container">{error}</div>;
  }

  if (!userData) {
    return <div className="dashboard-container">No user data found.</div>;
  }

  const { role } = userData;

  return (
    role === 'jobseeker' ? (
      <JobseekerDashboard userData={userData} />
    ) : (
      <EmployerDashboard userData={userData} />
    )
  );
};

export default Dashboard;
