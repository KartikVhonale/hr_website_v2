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
  FaFileAlt
} from 'react-icons/fa';
import '../../css/EmployerSidebar.css';

const EmployerSidebar = ({ activeSection, onSectionChange }) => {
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

  return (
    <div className={`employer-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && (
            <div className="logo-content">
              <h2>Employer Hub</h2>
              <span>Talent Management</span>
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
              onClick={() => onSectionChange('create-job')}
            >
              <FaPlus />
              <span>Post New Job</span>
            </button>
            <button 
              className="quick-action-btn secondary"
              onClick={() => onSectionChange('applications')}
            >
              <FaEye />
              <span>View Applications</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerSidebar;
