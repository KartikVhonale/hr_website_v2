import React, { useRef } from 'react';
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
  useScrollAnimation(heroRef);
  useScrollAnimation(featuredRef);

  return (
    <div className="employers-page">
      <section className="employers-hero" ref={heroRef}>
        <h1 className="employers-title">Find Top Talent for Your Team</h1>
        <p className="employers-desc">Connect with skilled professionals ready to make an impact. Streamline your hiring process and grow your business with TalentFlow.</p>
        <button className="employers-cta">Post a Job</button>
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