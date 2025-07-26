import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ id, title, excerpt, author, date, readTime, image, category }) => {
  const navigate = useNavigate();
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={image} alt={title} />
          {Array.isArray(category) ? (
            category.map((cat, index) => <div className="blog-category" key={index}>{cat}</div>)
          ) : (
            <div >{category}</div>
          )}
      </div>
      <div className="blog-card-content">
        <div className="blog-meta">
          <span className="blog-author">{author}</span>
          <span className="blog-date">{date}</span>
          <span className="blog-read-time">{readTime} min read</span>
        </div>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <button className="blog-read-more" onClick={() => navigate(`/articles/${id}`)}>Read More</button>
      </div>
    </div>
  );
};

export default BlogCard;
