import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link"><h1>TalentFlow</h1></Link>
        </div>
        <nav className="nav-menu">
          <ul className="nav-list">
            <li><Link to="/jobseekers" className="nav-link">For Jobseekers</Link></li>
            <li><Link to="/employers" className="nav-link">For Employers</Link></li>
            <li><Link to="/about" className="nav-link">About Us</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </nav>
        <button className="hamburger" onClick={handleSidebarToggle} aria-label="Open menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className="header-auth-buttons">
          <Link to="/login" className="header-btn header-login">Login</Link>
          <Link to="/signup" className="header-btn header-signup">Sign Up</Link>
        </div>
      </div>
      {/* Sidebar overlay */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={closeSidebar}></div>
      {/* Sidebar menu */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="close-sidebar" onClick={closeSidebar} aria-label="Close menu">&times;</button>
        <ul className="sidebar-list">
          <li><Link to="/jobseekers" className="sidebar-link" onClick={closeSidebar}>For Jobseekers</Link></li>
          <li><Link to="/employers" className="sidebar-link" onClick={closeSidebar}>For Employers</Link></li>
          <li><Link to="/about" className="sidebar-link" onClick={closeSidebar}>About Us</Link></li>
          <li><Link to="/contact" className="sidebar-link" onClick={closeSidebar}>Contact</Link></li>
          <li className="sidebar-auth">
            <Link to="/login" className="sidebar-btn" onClick={closeSidebar}>Login</Link>
            <Link to="/signup" className="sidebar-btn" onClick={closeSidebar}>Sign Up</Link>
          </li>
        </ul>
      </aside>
    </header>
  );
};

export default Header;
