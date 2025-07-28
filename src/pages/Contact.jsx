import React, { useRef, useState } from 'react';
import '../css/Main.css';
import useScrollAnimation from '../lib/useScrollAnimation';
import { FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaClock, FaUser, FaUserTie, FaRegUser, FaRegBuilding, FaRegCommentDots } from 'react-icons/fa';

const Contact = () => {
  const heroRef = useRef();
  const formRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(formRef);

  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      setSubmitted(true);
      setTimeout(() => {
        setForm({ name: '', email: '', phone: '', role: '', subject: '', message: '' });
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero" ref={heroRef}>
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-desc">Have a question, suggestion, or want to work with us? Fill out the form below and our team will get back to you soon.</p>
      </section>
      <section className="contact-section" ref={formRef}>
        <div className="contact-content contact-content-grid">
          {/* FORM CARD */}
          <form className="contact-form contact-card" onSubmit={handleSubmit} autoComplete="off" aria-label="Contact form">
            <h2 className="contact-form-title">Send us a Message</h2>
            <div className="contact-form-row">
              <div className="contact-field floating-label">
                <FaUser className="contact-input-icon" />
                <input className="contact-input" type="text" id="name" name="name" value={form.name} onChange={handleChange} required aria-label="Full Name" placeholder=" " />
                <label htmlFor="name">Full Name<span>*</span></label>
              </div>
              <div className="contact-field floating-label">
                <FaEnvelope className="contact-input-icon" />
                <input className="contact-input" type="email" id="email" name="email" value={form.email} onChange={handleChange} required aria-label="Email Address" placeholder=" " />
                <label htmlFor="email">Email Address<span>*</span></label>
              </div>
            </div>
            <div className="contact-form-row">
              <div className="contact-field floating-label">
                <FaPhone className="contact-input-icon" />
                <input className="contact-input" type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} pattern="[0-9\-\+\s\(\)]*" aria-label="Phone Number" placeholder=" " />
                <label htmlFor="phone">Phone Number</label>
              </div>
              <div className="contact-field floating-label">
                <FaRegUser className="contact-input-icon" />
                <select className="contact-input" id="role" name="role" value={form.role} onChange={handleChange} required aria-label="Role">
                  <option value="" disabled>Select your role</option>
                  <option value="jobseeker">Jobseeker</option>
                  <option value="employer">Employer</option>
                  <option value="partner">Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="contact-field floating-label">
              <FaRegCommentDots className="contact-input-icon" />
              <input className="contact-input" type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} required aria-label="Subject" placeholder=" " />
              <label htmlFor="subject">Subject</label>
            </div>
            <div className="contact-field floating-label">
              <FaRegCommentDots className="contact-input-icon" />
              <textarea className="contact-textarea" id="message" name="message" rows="5" value={form.message} onChange={handleChange} required aria-label="Message" placeholder=" "></textarea>
              <label htmlFor="message">Message</label>
            </div>
            <button className="contact-btn contact-btn-primary" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {submitted && <div className="contact-success">Thank you! We'll be in touch soon.</div>}
            {error && <div className="contact-error">{error}</div>}
          </form>

          {/* INFO CARD */}
          <div className="contact-info contact-card">
            <h2 className="contact-info-title">Contact Information</h2>
            <ul className="contact-info-list">
              <li><FaEnvelope className="contact-info-icon" /> <span>Email</span> <a href="mailto:hello@talentflow.com">hello@talentflow.com</a></li>
              <li><FaPhone className="contact-info-icon" /> <span>Phone</span> <a href="tel:+12345678900">+1 (234) 567-8900</a></li>
              <li><FaWhatsapp className="contact-info-icon" /> <span>WhatsApp</span> <a href="https://wa.me/12345678900" target="_blank" rel="noopener noreferrer">+1 (234) 567-8900</a></li>
              <li><FaMapMarkerAlt className="contact-info-icon" /> <span>Address</span> <span>123 Innovation Drive, San Francisco, CA 94105</span></li>
            </ul>
            <div className="contact-info-section">
              <h3 className="contact-info-subtitle"><FaClock className="contact-info-icon" /> Business Hours</h3>
              <ul className="contact-info-hours">
                <li>Monday - Friday: 10:00 AM - 6:00 PM PST</li>
                <li>Saturday: 10:00 AM - 4:00 PM PST</li>
                <li>Sunday: Closed</li>
              </ul>
              <div className="contact-info-note">Note: We typically respond to emails within 2-4 hours during business hours.</div>
            </div>
            <div className="contact-info-section">
              <h3 className="contact-info-subtitle">Quick Links</h3>
              <ul className="contact-info-links">
                <li><a href="/jobseekers">For Job Seekers →</a></li>
                <li><a href="/employers">For Employers →</a></li>
                <li><a href="/signup">Create Account →</a></li>
                <li><a href="/about">About TalentFlow →</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
