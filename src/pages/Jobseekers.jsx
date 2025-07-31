import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import JobCard from '../components/ui/JobCard';
import BlogCard from '../components/ui/BlogCard';
import useScrollAnimation from '../lib/useScrollAnimation';
import { Link } from 'react-router-dom'

const jobs = [
  {
    title: 'Frontend Developer',
    company: 'BlueTech',
    location: 'Remote',
    salary: '$80k-$110k',
  },
  {
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'New York, NY',
    salary: '$70k-$95k',
  },
  {
    title: 'Data Analyst',
    company: 'InsightWorks',
    location: 'San Francisco, CA',
    salary: '$90k-$120k',
  },
];

const Jobseekers = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch articles');
        }

        // Get only the latest 4 articles
        setArticles(data.data.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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
      
      <section className="jobseekers-featured" ref={featuredRef}>
        <h2 className="featured-title">Featured Jobs</h2>
        <div className="featured-jobs-list">
          {jobs.map((job, idx) => (
            <JobCard
              key={idx}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
            />
          ))}
        </div>
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
    </div>
  );
};

export default Jobseekers; 