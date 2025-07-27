import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/card';
import Button from '../ui/button';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const EmployerDashboard = ({ articles, handleDelete }) => { // Removed userData prop, will get from useAuth
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // Get user from context

  // Redirect if not authorized or if user is disabled
  if (authLoading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!user || user.role !== 'employer' || user.status === 'disabled' || !user.isAuthorized) {
    // Optionally redirect to login or a forbidden page
    // navigate('/login');
    return (
      <Card className="dashboard-card">
        <div className="dashboard-section-header error-message">
          You do not have permission to view this page.
        </div>
      </Card>
    );
  }

  // Render the dashboard content if authorized
  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate('/create-job')}>Post a New Job</Button>
      </div>
      <Card className="dashboard-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="dashboard-label" style={{ fontSize: 18 }}>{user.company}</div> {/* Use user.company */}
            <div className="dashboard-value">{user.email}</div> {/* Use user.email */}
            <div className="dashboard-value">Job Post: <b>Backend Developer</b></div>
          </div>
          <div style={{ fontWeight: 500, color: '#2563eb', fontSize: 16, marginTop: 8 }}>
            <b>3</b> applicants for this job
          </div>
        </div>
      </Card>
      <Card className="dashboard-card">
        <div className="dashboard-section-header" style={{ marginBottom: 20 }}>Your Articles</div>
        {articles.length > 0 ? (
          articles.map(article => (
            <div key={article._id} className="dashboard-article-item">
              <span>{article.title}</span>
              <div>
                <Button onClick={() => navigate(`/edit-article/${article._id}`)} style={{ marginRight: '8px' }}>Edit</Button>
                <Button onClick={() => handleDelete(article._id)} variant="danger">Delete</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="dashboard-empty">No articles found.</div>
        )}
      </Card>
    </>
  );
};

export default EmployerDashboard;
