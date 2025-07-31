import React from 'react';
import { useAuth } from '../context/AuthContext';
import EmployerDashboard from '../components/employer/EmployerDashboard';
import JobseekerDashboard from '../components/jobseeker/JobseekerDashboard';
import '../css/Dashboard.css';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!user) {
    return <div className="dashboard-container">You are not logged in.</div>;
  }

  const { role } = user;

  return (
    role === 'jobseeker' ? (
      <JobseekerDashboard userData={user} />
    ) : (
      <EmployerDashboard userData={user} />
    )
  );
};

export default Dashboard;
