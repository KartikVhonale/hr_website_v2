import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useScrollAnimation from '../lib/useScrollAnimation';
import '../css/Main.css';

const Employers = () => {
  const heroRef = useRef();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useScrollAnimation(heroRef);

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
      <section className="employers-featured">
        <h2 className="featured-title">Our Hiring Partners</h2>
        <p className="featured-desc">We partner with a diverse range of companies, from innovative startups to established industry leaders. Our platform connects you with opportunities across various sectors, helping you find the perfect fit for your skills and career goals.</p>
      </section>
    </div>
  );
};

export default Employers;
