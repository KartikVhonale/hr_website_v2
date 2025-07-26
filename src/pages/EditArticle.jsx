import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/CreateArticle.css';

const EditArticle = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`);
        const data = await response.json();
        if (data.success) {
          setTitle(data.data.title);
          setContent(data.data.content);
          setCategories(data.data.category);
          setImagePreview(data.data.image);
        }
      } catch (err) {
        setError("Failed to fetch article");
      }
    };
    fetchArticle();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = () => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setCategory('');
    }
  };

  const handleRemoveCategory = (catToRemove) => {
    setCategories(categories.filter(cat => cat !== catToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', categories);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update article');
      }

      if (user && user.role === 'admin') {
        navigate('/admin');
      } else if (user && user.role === 'employer') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article-page">
      <div className="create-article-container">
        <form className="create-article-form" onSubmit={handleSubmit}>
          <h2>Edit Article</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="imageFile">Upload Image</label>
          <input
            type="file"
            id="imageFile"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="category">Category</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="category-options"
            />
            <button type="button" onClick={handleAddCategory}>Add</button>
          </div>
          <datalist id="category-options">
            <option value="Career Tips" />
            <option value="Networking" />
            <option value="Remote Work" />
            <option value="Resume Tips" />
            <option value="Industry Trends" />
            <option value="Soft Skills" />
            <option value="Leadership" />
            <option value="Wellness" />
            <option value="Personal Branding" />
          </datalist>
          <div className="categories-list">
            {categories.map(cat => (
              <div key={cat} className="category-tag">
                {cat}
                <button type="button" onClick={() => handleRemoveCategory(cat)}>x</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Article'}
        </button>
      </form>
      <div className="article-preview">
        <h2>Article Preview</h2>
        <div className="preview-content">
          {imagePreview && <img src={imagePreview} alt="Preview" />}
          <h1>{title}</h1>
          <p>{content}</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditArticle;
