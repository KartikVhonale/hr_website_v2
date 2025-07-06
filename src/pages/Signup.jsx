import React, { useState } from 'react'; 
import '../css/Login.css';

const Signup = () => {
  const [role, setRole] = useState('jobseeker');

  return (
    <div className="login-page signup-page">
      <form className="login-form">
        <div className="login-role-toggle-pill" role="group" aria-label="Sign up as">
          <span className={`toggle-indicator${role === 'employer' ? ' right' : ''}`}></span>
          <button
            type="button"
            className={`role-pill-btn${role === 'jobseeker' ? ' active' : ''}`}
            onClick={() => setRole('jobseeker')}
            aria-pressed={role === 'jobseeker'}
          >
            Jobseeker
          </button>
          <button
            type="button"
            className={`role-pill-btn${role === 'employer' ? ' active' : ''}`}
            onClick={() => setRole('employer')}
            aria-pressed={role === 'employer'}
          >
            Employer
          </button>
        </div>
        <h2 className="login-title">Sign Up for TalentFlow</h2>
        <div className="login-field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" required />
        </div>
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Create a password" required />
        </div>
        <button type="submit" className="login-btn">Sign Up</button>
        <div className="login-signup-link">             
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Signup; 