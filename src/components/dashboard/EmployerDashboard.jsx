import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/card';
import Button from '../ui/button';

const EmployerDashboard = ({ userData, articles, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <>
      <Card className="dashboard-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="dashboard-label" style={{ fontSize: 18 }}>{userData.company}</div>
            <div className="dashboard-value">{userData.email}</div>
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
