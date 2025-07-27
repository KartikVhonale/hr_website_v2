import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Header.css';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeSidebar();
  };

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // if scroll down hide the navbar
        setVisible(false);
      } else {
        // if scroll up show the navbar
        setVisible(true);
      }
      // remember current page location to use in the next move
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <header className={`header ${visible ? 'visible' : 'hidden'}`}>
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link"><h1>TalentFlow</h1></Link>
        </div>
        <nav className="nav-menu">
          <ul className="nav-list">
            <li><Link to="/jobseekers" className="nav-link">For Jobseekers</Link></li>
            <li><Link to="/employers" className="nav-link">For Employers</Link></li>
            <li><Link to="/articles" className="nav-link">Articles</Link></li>
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
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="header-btn header-login">Dashboard</Link>
              <button onClick={handleLogout} className="header-btn header-signup">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn header-login">Login</Link>
              <Link to="/signup" className="header-btn header-signup">Sign Up</Link>
            </>
          )}
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
          <li><Link to="/articles" className="sidebar-link" onClick={closeSidebar}>Articles</Link></li>
          <li><Link to="/about" className="sidebar-link" onClick={closeSidebar}>About Us</Link></li>
          <li><Link to="/contact" className="sidebar-link" onClick={closeSidebar}>Contact</Link></li>
          <li className="sidebar-auth">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="sidebar-btn" onClick={closeSidebar}>Dashboard</Link>
                <button onClick={handleLogout} className="sidebar-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="sidebar-btn" onClick={closeSidebar}>Login</Link>
                <Link to="/signup" className="sidebar-btn" onClick={closeSidebar}>Sign Up</Link>
              </>
            )}
          </li>
        </ul>
      </aside>
    </header>
  );
};

export default Header;
