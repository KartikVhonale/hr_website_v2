import React, { useState } from 'react';
import { 
  FaUsers, 
  FaBriefcase, 
  FaFileAlt, 
  FaEnvelope, 
  FaUserFriends, 
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaCog
} from 'react-icons/fa';
import '../../css/AdminSidebar.css';

const AdminSidebar = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: FaTachometerAlt,
      description: 'Dashboard overview'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: FaUsers,
      description: 'Manage users and permissions'
    },
    {
      id: 'jobs',
      label: 'Job Management',
      icon: FaBriefcase,
      description: 'Manage job postings'
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FaClipboardList,
      description: 'View job applications'
    },
    {
      id: 'articles',
      label: 'Article Management',
      icon: FaFileAlt,
      description: 'Manage articles and content'
    },
    {
      id: 'contacts',
      label: 'Contact Management',
      icon: FaEnvelope,
      description: 'View contact submissions'
    },
    {
      id: 'team',
      label: 'Team Management',
      icon: FaUserFriends,
      description: 'Manage team members'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FaCog,
      description: 'System settings'
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && (
            <div className="logo-content">
              <h2>Admin Panel</h2>
              <span>HR Management</span>
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

      {/* <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-footer-content">
            <p>Talent Management</p>
            <span>© 2025 TalentFlow</span>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default AdminSidebar;
