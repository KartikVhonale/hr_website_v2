import React from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { FaEdit, FaTrash, FaKey } from 'react-icons/fa';

const UserManagement = ({ users, handleEditUser, handleDeleteUser, handleResetPassword, onAuthorizeUser, onUnauthorizeUser }) => {
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
    <Card className="dashboard-card">
      <div className="dashboard-section-header">User Management</div>

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

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Authorized employer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td>
                  {user.role === 'employer' ? (
                    <StatusBadge status={user.isAuthorized ? 'Authorized' : 'Unauthorized'} />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="actions">
                  <>
                    <Button size="sm" onClick={() => handleEditUser(user)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user._id)}>
                      <FaTrash /> Delete
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleResetPassword(user._id)}>
                      <FaKey /> Reset
                    </Button>
                    {user.role === 'employer' && (
                      <Button
                        size="sm"
                        variant={user.isAuthorized ? 'warning' : 'success'}
                        onClick={() => handleToggleAuthorize(user._id, !user.isAuthorized)}
                      >
                        {user.isAuthorized ? 'Unauthorize' : 'Authorize'}
                      </Button>
                    )}
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
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
