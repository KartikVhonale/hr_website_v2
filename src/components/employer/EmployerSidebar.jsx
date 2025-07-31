import React, { useState } from 'react';
import { 
  FaBriefcase, 
  FaClipboardList, 
  FaUsers, 
  FaChartBar,
  FaCalendarAlt,
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaCog,
  FaPlus,
  FaEye,
  FaUserCheck,
  FaFileAlt,
  FaTimes
} from 'react-icons/fa';
import '../../css/EmployerSidebar.css';

const EmployerSidebar = ({ activeSection, onSectionChange, isMobile, isOpen, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: FaTachometerAlt,
      description: 'Overview & Analytics'
    },
    {
      id: 'jobs',
      label: 'Job Management',
      icon: FaBriefcase,
      description: 'Create & manage jobs'
    },
    {
      id: 'articles',
      label: 'Articles',
      icon: FaFileAlt,
      description: 'Create & manage articles'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FaClipboardList,
      description: 'Review applications'
    },
    {
      id: 'candidates',
      label: 'Candidates',
      icon: FaUsers,
      description: 'Candidate database'
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: FaCalendarAlt,
      description: 'Schedule & manage'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: FaChartBar,
      description: 'Hiring insights'
    },
    {
      id: 'company',
      label: 'Company Profile',
      icon: FaBuilding,
      description: 'Manage company info'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FaCog,
      description: 'Account settings'
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  return (
    <div className={`employer-sidebar ${
      isCollapsed ? 'collapsed' : ''
    } ${
      isMobile ? 'mobile' : ''
    } ${
      isMobile && isOpen ? 'mobile-open' : ''
    }`}>
      <div className="sidebar-header">
        {isMobile && (
          <button className="mobile-close-btn" onClick={onToggle}>
            <FaTimes />
          </button>
        )}
        <div className="sidebar-logo">
          {(!isCollapsed || isMobile) && (
            <div className="logo-content">
              <h2>Employer Hub</h2>
              <span>Talent Management</span>
            </div>
          )}
        </div>
        {!isMobile && (
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="nav-icon">
                    <IconComponent />
                  </div>
                  {(!isCollapsed || isMobile) && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                  {isActive && <div className="active-indicator"></div>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {(!isCollapsed || isMobile) && (
          <div className="footer-content">
            <div className="quick-actions">
              <h4>Quick Actions</h4>
              <div className="action-buttons">
                <button 
                  className="action-btn primary"
                  onClick={() => handleItemClick('jobs')}
                  title="Post a new job"
                >
                  <FaPlus />
                  <span>Post Job</span>
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => handleItemClick('applications')}
                  title="Review applications"
                >
                  <FaEye />
                  <span>Review</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerSidebar;
