import React from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const TeamManagement = ({ team }) => {
  return (
    <Card className="dashboard-card">
      <div className="dashboard-section-header">Team Page</div>
      <div style={{ marginBottom: 16 }}>
        <Button size="sm" variant="secondary"><FaUser /> Add Member</Button>
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
                  <Button size="sm"><FaEdit /> Edit</Button>
                  <Button size="sm" variant="destructive"><FaTrash /> Delete</Button>
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
