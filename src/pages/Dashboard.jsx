import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/button';
import EmployerDashboard from '../components/dashboard/EmployerDashboard';
import JobseekerDashboard from '../components/dashboard/JobseekerDashboard';
import '../css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [articles, setArticles] = useState([]);
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

  useEffect(() => {
    const fetchArticles = async () => {
      if (!userData) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
        const data = await response.json();
        if (data.success) {
          const userArticles = data.data.filter(article => article.author._id === userData._id);
          setArticles(userArticles);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };

    if (userData && userData.role === 'employer') {
      fetchArticles();
    }
  }, [userData]);

  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete article');
      }

      setArticles(articles.filter(article => article._id !== articleId));
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

  if (!userData) {
    return <div className="dashboard-container">No user data found.</div>;
  }

  const { role } = userData;

  return (
    <div className="dashboard-container">
      {role === 'jobseeker' ? (
        <JobseekerDashboard userData={userData} />
      ) : (
        <EmployerDashboard userData={userData} articles={articles} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default Dashboard;
