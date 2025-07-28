import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';

const AddUserModal = ({ isOpen, onRequestClose, onUserAdded }) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add user');
      }

      setSuccess('User added successfully!');
      onUserAdded(data.user);
      setTimeout(() => {
        onRequestClose();
        setSuccess('');
        setName('');
        setEmail('');
        setPassword('');
        setRole('jobseeker');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add User Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="jobseeker">Jobseeker</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add User</button>
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
