import React, { useState } from 'react';
import { 
  FaSearch, 
  FaBookmark, 
  FaFileAlt, 
  FaChartLine,
  FaCalendarAlt,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaCog,
  FaPlus,
  FaEye,
  FaUserEdit,
  FaBriefcase,
  FaGraduationCap,
  FaBell
} from 'react-icons/fa';
import '../../css/JobseekerSidebar.css';

const JobseekerSidebar = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: FaTachometerAlt,
      description: 'Overview & Progress'
    },
    {
      id: 'job-search',
      label: 'Job Search',
      icon: FaSearch,
      description: 'Find opportunities'
    },
    {
      id: 'saved-jobs',
      label: 'Saved Jobs',
      icon: FaBookmark,
      description: 'Bookmarked positions'
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: FaFileAlt,
      description: 'Application status'
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: FaCalendarAlt,
      description: 'Schedule & history'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: FaUser,
      description: 'Personal information'
    },
    {
      id: 'resume',
      label: 'Resume Builder',
      icon: FaGraduationCap,
      description: 'Build your resume'
    },
    {
      id: 'career-insights',
      label: 'Career Insights',
      icon: FaChartLine,
      description: 'Market trends'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: FaBell,
      description: 'Job alerts & updates'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FaCog,
      description: 'Account preferences'
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`jobseeker-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && (
            <div className="logo-content">
              <h2>Career Hub</h2>
              <span>Your Job Journey</span>
            </div>
          )}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="sidebar-item">
                <button
                  className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="sidebar-icon">
                    <IconComponent />
                  </div>
                  {!isCollapsed && (
                    <div className="sidebar-content">
                      <span className="sidebar-label">{item.label}</span>
                      <span className="sidebar-description">{item.description}</span>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="sidebar-quick-actions">
          <h4>Quick Actions</h4>
          <div className="quick-action-buttons">
            <button 
              className="quick-action-btn primary"
              onClick={() => onSectionChange('job-search')}
            >
              <FaSearch />
              <span>Find Jobs</span>
            </button>
            <button 
              className="quick-action-btn secondary"
              onClick={() => onSectionChange('profile')}
            >
              <FaUserEdit />
              <span>Update Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobseekerSidebar;
