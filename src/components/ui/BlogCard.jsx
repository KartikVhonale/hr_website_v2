import React from 'react';

const BlogCard = ({ title, excerpt, author, date, readTime, image, category }) => {
  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img src={image} alt={title} />
        <div className="blog-category">{category}</div>
      </div>
      <div className="blog-card-content">
        <div className="blog-meta">
          <span className="blog-author">{author}</span>
          <span className="blog-date">{date}</span>
          <span className="blog-read-time">{readTime} min read</span>
        </div>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <button className="blog-read-more">Read More</button>
      </div>
    </div>
  );
};

export default BlogCard; 