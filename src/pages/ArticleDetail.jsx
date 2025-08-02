import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { articlesAPI } from '../api/index.js';
import '../css/ArticleDetail.css';

const ArticleDetail = () => {
  const { token, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articlesAPI.getArticleById(id);
        setArticle(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="articles-page" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div className="articles-page" style={{ padding: '2rem', textAlign: 'center' }}>{error}</div>;
  }

  if (!article) {
    return (
      <div className="articles-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p>The article you are looking for does not exist.</p>
        <button className="blogs-view-all" onClick={() => navigate('/articles')}>Back to Articles</button>
      </div>
    );
  }

  const handleLike = async () => {
    const originalArticle = { ...article };
    const newArticle = { ...article };
    const userId = user.id;

    const hasLiked = newArticle.likes.includes(userId);
    const hasDisliked = newArticle.dislikes.includes(userId);

    if (hasLiked) {
      newArticle.likes = newArticle.likes.filter(id => id !== userId);
    } else {
      newArticle.likes.push(userId);
      if (hasDisliked) {
        newArticle.dislikes = newArticle.dislikes.filter(id => id !== userId);
      }
    }

    setArticle(newArticle);

    try {
      await articlesAPI.toggleArticleLike(id);
    } catch (error) {
      setArticle(originalArticle);
      console.error(error);
    }
  };

  const handleDislike = async () => {
    const originalArticle = { ...article };
    const newArticle = { ...article };
    const userId = user.id;

    const hasLiked = newArticle.likes.includes(userId);
    const hasDisliked = newArticle.dislikes.includes(userId);

    if (hasDisliked) {
      newArticle.dislikes = newArticle.dislikes.filter(id => id !== userId);
    } else {
      newArticle.dislikes.push(userId);
      if (hasLiked) {
        newArticle.likes = newArticle.likes.filter(id => id !== userId);
      }
    }

    setArticle(newArticle);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}/dislike`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setArticle(originalArticle);
      }
    } catch (error) {
      setArticle(originalArticle);
      console.error(error);
    }
  };

  return (
    <div className="article-detail-page">
      <button className="blogs-view-all" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="article-detail-card">
        {article.image && <img src={article.image} alt={article.title} />}
        <div className="category">{article.category}</div>
        <h1>{article.title}</h1>
        <div className="meta">By {article.author ? article.author.name : 'Unknown Author'}</div>
        <div className="content">{article.content}</div>
        <div className="like-dislike-buttons">
          <button onClick={handleLike}><FaThumbsUp /> {article.likes.length}</button>
          <button onClick={handleDislike}><FaThumbsDown /> {article.dislikes.length}</button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
