import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../api/index.js';
import '../css/Login.css';

const Signup = () => {
  const [role, setRole] = useState('jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.signup({ name, email, password, role });

      // Store token and user data
      login(data.user, data.token);

      // Navigate to the appropriate dashboard
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page signup-page">
      <form className="login-form" onSubmit={handleSubmit}>
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
        {error && <p className="login-error">{error}</p>}
        <div className="login-field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="login-field">
          <label htmlFor="confirmPassword">Repeat Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="login-signup-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
