import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/card';
import Button from '../ui/button';
import { FaEdit, FaTrash, FaStar, FaSearch } from 'react-icons/fa';

const ArticleManagement = ({ articles, setArticles }) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
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
        console.error(err);
      }
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="dashboard-section-header">Article Manager</div>
      <div className="section-header">
        <h2>Articles</h2>
        <div className="btn-group">
          <button className="btn btn-primary btn-icon" onClick={() => navigate('/create-article')}>
            <FaEdit /> New Article
          </button>
          <button className="btn btn-secondary btn-icon">
            <FaSearch /> Search
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.author ? article.author.name : 'Unknown'}</td>
                <td><StatusBadge status={article.status} /></td>
                <td>{article.featured ? <FaStar color="#f59e42" /> : <FaStar color="#e5e7eb" />}</td>
                <td className="actions">
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm btn-icon" onClick={() => navigate(`/edit-article/${article._id}`)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDeleteArticle(article._id)}>
                      <FaTrash /> Delete
                    </button>
                    <button className="btn btn-info btn-sm btn-icon">
                      <FaStar /> Toggle
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  let color = '#64748b';
  let bg = '#e0e7ef';
  if (['active', 'approved', 'published', 'open', 'applied'].includes(status)) { color = '#059669'; bg = '#d1fae5'; }
  if (['pending', 'review', 'draft'].includes(status)) { color = '#f59e42'; bg = '#fef3c7'; }
  if (['resolved', 'selected', 'featured'].includes(status)) { color = '#2563eb'; bg = '#dbeafe'; }
  if (['rejected', 'disabled'].includes(status)) { color = '#dc2626'; bg = '#fee2e2'; }
  return <span style={{ background: bg, color, fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '2px 10px', marginLeft: 6 }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default ArticleManagement;
