import React from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/button.tsx';
import { FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import '../../css/AdminComponents-mobile.css';

const UserManagement = ({ users, handleEditUser, handleDeleteUser, handleResetPassword, onAuthorizeUser, onUnauthorizeUser, onAddUser }) => {
  const [userSearch, setUserSearch] = React.useState('');
  const [userRole, setUserRole] = React.useState('all');

  const filteredUsers = users.filter(u =>
    (userRole === 'all' || u.role === userRole) &&
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const handleToggleAuthorize = (userId, isAuthorized) => {
    if (onAuthorizeUser) {
      onAuthorizeUser(userId, isAuthorized);
    }
  };

  return (
    <div className="user-management">
      <Card className="dashboard-card">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="btn-group">
            <button className="btn btn-primary btn-icon" onClick={onAddUser}>
              <FaEdit /> <span>Add User</span>
            </button>
          </div>
        </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
        />
        <select value={userRole} onChange={e => setUserRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="jobseeker">Jobseeker</option>
          <option value="employer">Employer</option>
        </select>
      </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td>
                    <span className="role-badge">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    {user.role === 'employer' ? (
                      <StatusBadge status={user.isAuthorized ? 'Authorized' : 'Unauthorized'} />
                    ) : (
                      <span className="status-badge">Active</span>
                    )}
                  </td>
                  <td className="actions">
                    <div className="btn-group">
                      <button className="btn btn-warning btn-sm btn-icon" onClick={() => handleEditUser(user)}>
                        <FaEdit /> <span>Edit</span>
                      </button>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => handleResetPassword(user._id)}>
                        <FaKey /> <span>Reset</span>
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDeleteUser(user._id)}>
                        <FaTrash /> <span>Delete</span>
                      </button>
                      {user.role === 'employer' && (
                        <button
                          className={`btn btn-sm btn-icon ${user.isAuthorized ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggleAuthorize(user._id, !user.isAuthorized)}
                        >
                          <span>{user.isAuthorized ? 'Unauthorize' : 'Authorize'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let color = '#64748b';
  let bg = '#e0e7ef';

  if (['active', 'approved', 'published', 'open', 'applied', 'Authorized'].includes(status)) {
    color = '#059669';
    bg = '#d1fae5';
  }
  if (['pending', 'review', 'draft'].includes(status)) {
    color = '#f59e42';
    bg = '#fef3c7';
  }
  if (['resolved', 'selected', 'featured'].includes(status)) {
    color = '#2563eb';
    bg = '#dbeafe';
  }
  if (['rejected', 'disabled', 'Unauthorized'].includes(status)) {
    color = '#dc2626';
    bg = '#fee2e2';
  }

  return (
    <span
      style={{
        background: bg,
        color,
        fontWeight: 600,
        fontSize: 13,
        borderRadius: 8,
        padding: '2px 10px',
        marginLeft: 6
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default UserManagement;
