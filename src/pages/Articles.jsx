import React, { useState, useRef } from 'react';
import '../css/Main.css';
import BlogCard from '../components/ui/BlogCard';
import useScrollAnimation from '../lib/useScrollAnimation';

const allArticles = [
  {
    id: 1,
    title: 'How to Ace Your Technical Interview',
    excerpt: 'Master the art of technical interviews with our comprehensive guide covering coding challenges, system design, and behavioral questions.',
    author: 'Sarah Johnson',
    date: 'Dec 15, 2024',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop',
    category: 'Career Tips',
    featured: true
  },
  {
    id: 2,
    title: 'Building a Strong Professional Network',
    excerpt: 'Learn effective strategies to build and maintain professional relationships that can advance your career and open new opportunities.',
    author: 'Michael Chen',
    date: 'Dec 12, 2024',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    category: 'Networking',
    featured: true
  },
  {
    id: 3,
    title: 'Remote Work Best Practices',
    excerpt: 'Discover proven strategies to stay productive, maintain work-life balance, and thrive in remote work environments.',
    author: 'Emily Rodriguez',
    date: 'Dec 10, 2024',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop',
    category: 'Remote Work',
    featured: true
  },
  {
    id: 4,
    title: 'Resume Writing Secrets That Get You Hired',
    excerpt: 'Transform your resume with expert tips on formatting, keyword optimization, and highlighting your achievements effectively.',
    author: 'David Kim',
    date: 'Dec 8, 2024',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    category: 'Resume Tips',
    featured: true
  },
  {
    id: 5,
    title: 'Salary Negotiation Strategies for Tech Professionals',
    excerpt: 'Learn how to confidently negotiate your salary and benefits package to maximize your earning potential in the tech industry.',
    author: 'Lisa Thompson',
    date: 'Dec 5, 2024',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1554224154-26032cdc0c0f?w=400&h=250&fit=crop',
    category: 'Career Tips',
    featured: false
  },
  {
    id: 6,
    title: 'The Future of Work: AI and Automation',
    excerpt: 'Explore how artificial intelligence and automation are reshaping the job market and what skills you need to stay competitive.',
    author: 'Alex Rivera',
    date: 'Dec 3, 2024',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
    category: 'Industry Trends',
    featured: false
  },
  {
    id: 7,
    title: 'Effective Communication in the Workplace',
    excerpt: 'Master the art of professional communication to build better relationships and advance your career.',
    author: 'Jennifer Park',
    date: 'Nov 30, 2024',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    category: 'Soft Skills',
    featured: false
  },
  {
    id: 8,
    title: 'Leadership Skills for Non-Managers',
    excerpt: 'Develop leadership qualities that will help you stand out and prepare for future management opportunities.',
    author: 'Robert Wilson',
    date: 'Nov 28, 2024',
    readTime: 11,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    category: 'Leadership',
    featured: false
  },
  {
    id: 9,
    title: 'Work-Life Balance in the Digital Age',
    excerpt: 'Find the right balance between your professional and personal life in today\'s always-connected world.',
    author: 'Maria Garcia',
    date: 'Nov 25, 2024',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    category: 'Wellness',
    featured: false
  },
  {
    id: 10,
    title: 'Freelancing vs Full-Time: Making the Right Choice',
    excerpt: 'Compare the pros and cons of freelancing versus full-time employment to make the best decision for your career.',
    author: 'Tom Anderson',
    date: 'Nov 22, 2024',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop',
    category: 'Career Tips',
    featured: false
  },
  {
    id: 11,
    title: 'Digital Marketing Career Path Guide',
    excerpt: 'Navigate the evolving landscape of digital marketing and discover the skills needed for success in this dynamic field.',
    author: 'Sophie Lee',
    date: 'Nov 20, 2024',
    readTime: 13,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    category: 'Industry Trends',
    featured: false
  },
  {
    id: 12,
    title: 'Building Your Personal Brand Online',
    excerpt: 'Create a compelling personal brand that showcases your expertise and attracts career opportunities.',
    author: 'Chris Martinez',
    date: 'Nov 18, 2024',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop',
    category: 'Personal Branding',
    featured: false
  }
];

const categories = ['All', 'Career Tips', 'Networking', 'Remote Work', 'Resume Tips', 'Industry Trends', 'Soft Skills', 'Leadership', 'Wellness', 'Personal Branding'];

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const heroRef = useRef();
  const articlesRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(articlesRef);

  // Filter articles based on category and search query
  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchQuery.toLowerCase());
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
              key={article.id}
              title={article.title}
              excerpt={article.excerpt}
              author={article.author}
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