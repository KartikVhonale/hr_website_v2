import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';
import { authAPI } from '../api/index.js';
import '../css/Login.css';

const Login = () => {
  const [role, setRole] = useState('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
      // Optional: Clear the message from state so it doesn't reappear on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login({ email, password });

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
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-role-toggle-pill" role="group" aria-label="Login as">
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
        <h2 className="login-title">Login to TalentFlow</h2>
        {infoMessage && (
          <div className="login-info-message">
            <FaInfoCircle />
            <span>{infoMessage}</span>
          </div>
        )}
        {error && <p className="login-error">{error}</p>}
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
              placeholder="Enter your password"
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
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="login-signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
