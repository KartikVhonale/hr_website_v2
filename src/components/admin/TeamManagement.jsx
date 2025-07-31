import React from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/button.tsx';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const TeamManagement = ({ team }) => {
  return (
    <Card className="dashboard-card">
      <div className="section-header">
        <h2>Team Management</h2>
        <div className="btn-group">
          <button className="btn btn-primary btn-icon">
            <FaUser /> Add Member
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map(member => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td className="actions">
                  <div className="btn-group">
                    <button className="btn btn-warning btn-sm btn-icon">
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm btn-icon">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TeamManagement;
