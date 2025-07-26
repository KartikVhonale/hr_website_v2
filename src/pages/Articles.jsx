import React, { useState, useEffect, useRef } from 'react';
import '../css/Main.css';
import BlogCard from '../components/ui/BlogCard';
import useScrollAnimation from '../lib/useScrollAnimation';

const Articles = () => {
  const [categories, setCategories] = useState(['All']);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const heroRef = useRef();
  const articlesRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(articlesRef);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch articles');
        }

        setAllArticles(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/categories`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch categories');
        }

        setCategories(['All', ...data.data]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  // Filter articles based on category and search query
  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || (Array.isArray(article.category) && article.category.includes(selectedCategory));
    const authorName = article.author ? article.author.name : '';
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="articles-page">
      <section className="articles-hero" ref={heroRef}>
        <h1 className="articles-title">Career Insights & Articles</h1>
        <p className="articles-desc">Discover expert advice, industry trends, and career development tips to advance your professional journey.</p>
        
        <div className="articles-search">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="articles-search-input"
          />
        </div>

        <div className="articles-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="articles-content" ref={articlesRef}>
        <div className="articles-header">
          <h2 className="articles-results">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'} Found
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` for "${searchQuery}"`}
          </h2>
        </div>

        <div className="articles-grid">
          {currentArticles.map((article) => (
            <BlogCard
              key={article._id}
              id={article._id}
              title={article.title}
              excerpt={article.content.substring(0, 100) + '...'}
              author={article.author ? article.author.name : 'Unknown Author'}
              date={article.date}
              readTime={article.readTime}
              image={article.image}
              category={article.category}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="articles-pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="articles-empty">
            <h3>No articles found</h3>
            <p>Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Articles;
