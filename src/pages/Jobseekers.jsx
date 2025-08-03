import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import BlogCard from '../components/ui/BlogCard';
import useScrollAnimation from '../lib/useScrollAnimation';
import { Link } from 'react-router-dom';
import { articlesAPI, jobsAPI } from '../api/index.js';
import FeaturedJobs from '../components/jobseeker/FeaturedJobs';



const Jobseekers = () => {
  const [articles, setArticles] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const heroRef = useRef();
  const featuredRef = useRef();
  const blogsRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(featuredRef);
  useScrollAnimation(blogsRef);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articlesAPI.getRecentArticles(4);
        setArticles(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await jobsAPI.getAllJobs();
        let jobs = [];
      if (response && response.data && response.data.success) {
        jobs = response.data.data || [];
      } else if (response && Array.isArray(response.data)) {
        jobs = response.data;
      } else if (response && Array.isArray(response)) {
        jobs = response;
      }
      if (!Array.isArray(jobs)) {
        jobs = [];
      }
      const featured = jobs.slice(0, 4).map(job => ({
        ...job,
        isFeatured: true,
        companyLogo: job.employer?.logo || 'https://via.placeholder.com/40'
      }));
      setFeaturedJobs(featured);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setFeaturedJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

    fetchArticles();
    fetchJobs();
  }, []);

  const handleViewAllArticles = () => {
    navigate('/articles');
  };

  return (
    <div className="jobseekers-page">
      <section className="jobseekers-hero" ref={heroRef}>
        <h1 className="jobseekers-title">Find Your Next Opportunity</h1>
        <p className="jobseekers-desc">Discover jobs tailored to your skills and interests. Apply in one click and take the next step in your career with TalentFlow.</p>
        <Link to="/jobs"><button className="jobseekers-cta">Browse Jobs</button></Link>
        
      </section>
      

      <section className="jobseekers-blogs" ref={blogsRef}>
        <h2 className="blogs-title">Career Insights & Tips</h2>
        <p className="blogs-subtitle">Stay ahead in your career with expert advice and industry insights</p>
        <div className="blogs-grid">
          {loading ? (
            <div>Loading articles...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            articles.map((article) => (
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
            ))
          )}
        </div>
        <div className="blogs-cta">
          <button className="blogs-view-all" onClick={handleViewAllArticles}>View All Articles</button>
        </div>
      </section>
      {jobsLoading ? <div>Loading jobs...</div> : featuredJobs.length > 0 && <FeaturedJobs featuredJobs={featuredJobs} />}
    </div>
  );
};

export default Jobseekers;
