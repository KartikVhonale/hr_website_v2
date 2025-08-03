import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Main.css';
import useScrollAnimation from '../lib/useScrollAnimation';

const employers = [
  {
    name: 'BlueTech',
    industry: 'Technology',
    location: 'Remote',
    size: '200+ employees',
  },
  {
    name: 'Designify',
    industry: 'Design',
    location: 'New York, NY',
    size: '50+ employees',
  },
  {
    name: 'InsightWorks',
    industry: 'Analytics',
    location: 'San Francisco, CA',
    size: '120+ employees',
  },
];

const Employers = () => {
  const heroRef = useRef();
  const featuredRef = useRef();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useScrollAnimation(heroRef);
  useScrollAnimation(featuredRef);

  const handlePostJobClick = () => {
    if (loading) {
      // Still checking authentication status
      return;
    }

    if (user) {
      // User is logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, redirect to login page
      navigate('/login');
    }
  };

  return (
    <div className="employers-page">
      <section className="employers-hero" ref={heroRef}>
        <h1 className="employers-title">Find Top Talent for Your Team</h1>
        <p className="employers-desc">Connect with skilled professionals ready to make an impact. Streamline your hiring process and grow your business with TalentFlow.</p>
        <button
          className="employers-cta"
          onClick={handlePostJobClick}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Post a Job'}
        </button>
      </section>
      <section className="employers-featured" ref={featuredRef}>
        <h2 className="featured-title">Featured Employers</h2>
        <div className="featured-employers-list">
          {employers.map((employer, idx) => (
            <div className="employer-card" key={idx}>
              <h3>{employer.name}</h3>
              <p>{employer.industry} • {employer.location} • {employer.size}</p>
              <button className="apply-btn">View Jobs</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Employers; 