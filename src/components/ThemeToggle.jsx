import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../css/ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
    </button>
  );
};

export default ThemeToggle; 