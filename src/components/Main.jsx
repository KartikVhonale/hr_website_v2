import React, { useRef } from 'react';
import '../css/Main.css';
import { FaBriefcase, FaUserTie, FaChartLine, FaClock, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import useScrollAnimation from '../lib/useScrollAnimation';

const Main = () => {
  const heroRef = useRef();
  const featuresRef = useRef();
  const statsRef = useRef();
  const jobSeekersRef = useRef();
  const employersRef = useRef();
  const ctaRef = useRef();

  useScrollAnimation(heroRef);
  useScrollAnimation(featuresRef);
  useScrollAnimation(statsRef);
  useScrollAnimation(jobSeekersRef);
  useScrollAnimation(employersRef);
  useScrollAnimation(ctaRef);

  return (
    <main className="main">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <h1>Connect Talent with Opportunity</h1>
          <p>Your premier destination for career growth and talent acquisition. We bridge the gap between exceptional candidates and leading employers.</p>
          <div className="hero-buttons">
            <button className="cta-button primary">Find Jobs</button>
            <button className="cta-button secondary">Hire Talent</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <h2>Why Choose TalentFlow?</h2>
        <p className="section-subtitle">Experience the future of recruitment with our AI-powered matching and comprehensive career services</p>
        <div className="features-grid">
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Smart Job Matching</h3>
            <p>AI-powered algorithms match your skills and preferences with the perfect job opportunities</p>
          </div>
          <div className="feature-card">
            <FaUserTie className="feature-icon" />
            <h3>Quality Candidates</h3>
            <p>Access pre-screened, qualified candidates ready to contribute to your organization's success</p>
          </div>
          <div className="feature-card">
            <FaBriefcase className="feature-icon" />
            <h3>Career Resources</h3>
            <p>Comprehensive guides, tips, and resources to help you excel in your career journey</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Active Job Listings</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Partner Companies</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Success Rate</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Career Support</p>
          </div>
        </div>
      </section>

      {/* Job Seekers Section */}
      <section className="content job-seekers" ref={jobSeekersRef}>
        <div className="content-container">
          <div className="content-text">
            <h2>For Job Seekers</h2>
            <p>Whether you're a fresh graduate or an experienced professional, we provide the tools and opportunities to advance your career.</p>
            <ul className="benefits-list">
              <li>Personalized Job Recommendations</li>
              <li>Resume Building & Career Tips</li>
              <li>Direct Employer Connections</li>
            </ul>
            <button className="cta-button">Start Your Journey</button>
          </div>
          <div className="content-features">
            <div className="mini-feature">
              <FaChartLine className="mini-feature-icon" />
              <div>
                <h4>Personalized Job Recommendations</h4>
                <p>Get matched with jobs that fit your skills and career goals</p>
              </div>
            </div>
            <div className="mini-feature">
              <FaBriefcase className="mini-feature-icon" />
              <div>
                <h4>Resume Building & Career Tips</h4>
                <p>Expert guidance to enhance your profile and interview skills</p>
              </div>
            </div>
            <div className="mini-feature">
              <FaBuilding className="mini-feature-icon" />
              <div>
                <h4>Direct Employer Connections</h4>
                <p>Connect directly with hiring managers and decision makers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employers Section */}
      <section className="content employers" ref={employersRef}>
        <div className="content-container reverse">
          <div className="content-text">
            <h2>For Employers</h2>
            <p>Streamline your hiring process and find the perfect candidates faster than ever before with our comprehensive recruitment platform.</p>
            <ul className="benefits-list">
              <li>Access Quality Talent Pool</li>
              <li>Streamlined Interview Process</li>
              <li>Dedicated Support</li>
            </ul>
            <button className="cta-button">Find Talent Today</button>
          </div>
          <div className="content-features">
            <div className="mini-feature">
              <FaUserTie className="mini-feature-icon" />
              <div>
                <h4>Access Quality Talent Pool</h4>
                <p>Connect with pre-screened candidates across all experience levels</p>
              </div>
            </div>
            <div className="mini-feature">
              <FaCheckCircle className="mini-feature-icon" />
              <div>
                <h4>Streamlined Interview Process</h4>
                <p>Schedule interviews and track candidates seamlessly</p>
              </div>
            </div>
            <div className="mini-feature">
              <FaClock className="mini-feature-icon" />
              <div>
                <h4>Dedicated Support</h4>
                <p>Get expert assistance throughout your hiring journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section" ref={ctaRef}>
        <h2>Ready to Take the Next Step?</h2>
        <p>Join thousands of professionals and companies who trust TalentFlow for their career and hiring needs.</p>
        <div className="cta-buttons">
          <button className="cta-button primary">Get Started Today</button>
          <button className="cta-button secondary">Contact Our Team</button>
        </div>
      </section>
    </main>
  );
};

export default Main;
