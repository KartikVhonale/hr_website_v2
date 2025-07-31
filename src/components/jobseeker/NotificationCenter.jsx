import React, { useState, useEffect } from 'react';
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
  FaEyeSlash,
  FaSpinner
} from 'react-icons/fa';
import '../../css/NotificationCenter.css';

const NotificationCenter = ({ notifications, setNotifications }) => {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const markAsRead = async (id) => {
    try {
      // In a real implementation, you would call an API to mark notification as read
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In a real implementation, you would call an API to mark all notifications as read
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      // In a real implementation, you would call an API to delete the notification
      setNotifications(prev =>
        prev.filter(notif => notif._id !== id)
      );
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
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

  const filteredNotifications = filterNotifications(notifications, filter);
  const unreadCount = notifications.filter(notif => !notif.read).length;

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
            disabled={unreadCount === 0 || loading}
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
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  {getNotificationIcon(notification.type)}
                  <div className="notification-info">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">{formatTimestamp(notification.createdAt)}</span>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="action-btn read-btn"
                        onClick={() => markAsRead(notification._id)}
                        title="Mark as read"
                        disabled={loading}
                      >
                        <FaEye />
                      </button>
                    )}
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteNotification(notification._id)}
                      title="Delete notification"
                      disabled={loading}
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
