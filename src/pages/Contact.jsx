import React, { useRef, useState } from 'react';
import '../css/Main.css';
import useScrollAnimation from '../lib/useScrollAnimation';

const Contact = () => {
  const heroRef = useRef();
  const formRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(formRef);

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="contact-page">
      <section className="contact-hero" ref={heroRef}>
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-desc">Have a question, suggestion, or want to work with us? Fill out the form below and our team will get back to you soon.</p>
      </section>
      <section className="contact-section" ref={formRef}>
        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="contact-field">
              <label className="contact-label" htmlFor="name">Name</label>
              <input className="contact-input" type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="email">Email</label>
              <input className="contact-input" type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="phone">Phone Number</label>
              <input className="contact-input" type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} pattern="[0-9\-\+\s\(\)]*" />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="subject">Subject</label>
              <input className="contact-input" type="text" id="subject" name="subject" value={form.subject} onChange={handleChange} required />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="message">Message</label>
              <textarea className="contact-textarea" id="message" name="message" rows="5" value={form.message} onChange={handleChange} required></textarea>
            </div>
            <button className="contact-btn" type="submit">Send Message</button>
            {submitted && <div className="contact-success">Thank you! We'll be in touch soon.</div>}
          </form>
          <div className="contact-info">
            <h2>Let's Connect</h2>
            <p>We're here to help you with any questions about TalentFlow, partnerships, or support. Reach out and our team will respond promptly!</p>
            <p style={{marginTop: '1.5rem', color: 'var(--accent-primary, #0051a2)', fontWeight: 600}}>Email: support@talentflow.com<br/>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 