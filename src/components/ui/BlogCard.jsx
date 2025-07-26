import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ id, title, excerpt, author, date, readTime, image, category }) => {
  const navigate = useNavigate();

  let parsedCategories = [];
  if (Array.isArray(category)) {
    parsedCategories = category.flatMap(cat => cat.split(',').map(c => c.trim()));
  } else if (typeof category === 'string') {
    parsedCategories = category.split(',').map(c => c.trim());
  }
  const maxCategoriesToShow = 2;
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={image} alt={title} />
        <div className="blog-categories">
          {parsedCategories.slice(0, maxCategoriesToShow).map((cat, index) => (
            <div className="blog-category" key={index}>{cat}</div>
          ))}
          {parsedCategories.length > maxCategoriesToShow && <div className="blog-category">...</div>}
        </div>
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
