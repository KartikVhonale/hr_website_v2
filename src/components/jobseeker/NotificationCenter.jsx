import React, { useState } from 'react';
import { 
  FaBell, 
  FaEnvelope,
  FaCalendarAlt,
  FaBriefcase,
  FaCheckCircle,
  FaTimes,
  FaFilter,
  FaTrash,
  FaCog,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const NotificationCenter = ({ notifications, setNotifications }) => {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'application',
      title: 'Application Status Update',
      message: 'Your application for Frontend Developer at TechCorp has been reviewed',
      timestamp: '2024-01-24T10:30:00Z',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'You have an interview tomorrow at 2:00 PM with Design Studio',
      timestamp: '2024-01-24T09:15:00Z',
      read: false,
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'job',
      title: 'New Job Match',
      message: '5 new jobs match your preferences in San Francisco',
      timestamp: '2024-01-24T08:00:00Z',
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'message',
      title: 'Message from Recruiter',
      message: 'Sarah from InnovateTech sent you a message about a new opportunity',
      timestamp: '2024-01-23T16:45:00Z',
      read: true,
      priority: 'medium'
    }
  ];

  const [displayNotifications, setDisplayNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return <FaBriefcase className="notification-icon application" />;
      case 'interview':
        return <FaCalendarAlt className="notification-icon interview" />;
      case 'job':
        return <FaBell className="notification-icon job" />;
      case 'message':
        return <FaEnvelope className="notification-icon message" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'priority-urgent';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAsRead = (id) => {
    setDisplayNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setDisplayNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setDisplayNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  const filterNotifications = (notifications, filter) => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.read);
      case 'application':
      case 'interview':
      case 'job':
      case 'message':
        return notifications.filter(notif => notif.type === filter);
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications(displayNotifications, filter);
  const unreadCount = displayNotifications.filter(notif => !notif.read).length;

  return (
    <div className="notification-center-section">
      <div className="notifications-header">
        <div className="header-content">
          <h2>Notifications</h2>
          <p>Stay updated on your job search progress</p>
        </div>
        <div className="header-actions">
          <div className="unread-badge">
            {unreadCount > 0 && (
              <span className="badge">{unreadCount} unread</span>
            )}
          </div>
          <button 
            className="action-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <FaCheckCircle /> Mark All Read
          </button>
          <button 
            className="action-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog /> Settings
          </button>
        </div>
      </div>

      <div className="notifications-controls">
        <div className="filter-group">
          <FaFilter className="control-icon" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="control-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="application">Applications</option>
            <option value="interview">Interviews</option>
            <option value="job">Job Alerts</option>
            <option value="message">Messages</option>
          </select>
        </div>
      </div>

      {showSettings && (
        <div className="notification-settings">
          <h3>Notification Preferences</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Email notifications for new job matches
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Application status updates
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" defaultChecked />
                Interview reminders
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" />
                Weekly job market insights
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  {getNotificationIcon(notification.type)}
                  <div className="notification-info">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="action-btn read-btn"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <FaEye />
                      </button>
                    )}
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-notifications">
            <div className="empty-icon">
              <FaBell />
            </div>
            <h3>No notifications found</h3>
            <p>
              {filter === 'all' 
                ? "You're all caught up! No new notifications."
                : `No notifications found for "${filter}" filter.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
