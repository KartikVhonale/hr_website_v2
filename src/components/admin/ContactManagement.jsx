import React, { useState } from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/button.tsx';
import { FaEye, FaCheck, FaSearch, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ContactManagement = ({ contacts, setContacts }) => {
  const { token } = useAuth();
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  const handleMarkResolved = async (id, isResolved) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isResolved: !isResolved }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update contact status');
      }

      const updatedContact = await response.json();
      setContacts(
        contacts.map((contact) =>
          contact._id === id ? updatedContact.data : contact
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/contact/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete contact submission');
        }

        setContacts(contacts.filter((contact) => contact._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredContacts = contacts
    .filter((contact) => {
      if (statusFilter === 'all') {
        return true;
      }
      return statusFilter === 'resolved'
        ? contact.isResolved
        : !contact.isResolved;
    })
    .filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Card className="dashboard-card">
      <div className="section-header">
        <h2>Contact Form Submissions</h2>
        <div className="btn-group">
          <button className="btn btn-primary btn-icon">
            <FaSearch /> Search Contacts
          </button>
        </div>
      </div>
      <div className="filter-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.subject}</td>
                <td>
                  <StatusBadge isResolved={contact.isResolved} />
                </td>
                <td className="actions">
                  <div className="btn-group">
                    <button className="btn btn-info btn-sm btn-icon" onClick={() => handleViewDetails(contact)}>
                      <FaEye /> View
                    </button>
                    <button
                      className={`btn btn-sm btn-icon ${
                        contact.isResolved ? 'btn-warning' : 'btn-success'
                      }`}
                      onClick={() =>
                        handleMarkResolved(contact._id, contact.isResolved)
                      }
                    >
                      <FaCheck />{' '}
                      {contact.isResolved ? 'Mark as Open' : 'Mark as Resolved'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDelete(contact._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={handleCloseModal}
        />
      )}
    </Card>
  );
};

const ContactDetailsModal = ({ contact, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact Details</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>
            <strong>Name:</strong> {contact.name}
          </p>
          <p>
            <strong>Email:</strong> {contact.email}
          </p>
          <p>
            <strong>Phone:</strong> {contact.phone}
          </p>
          <p>
            <strong>Role:</strong> {contact.role}
          </p>
          <p>
            <strong>Subject:</strong> {contact.subject}
          </p>
          <p>
            <strong>Message:</strong> {contact.message}
          </p>
          <p>
            <strong>Status:</strong> <StatusBadge isResolved={contact.isResolved} />
          </p>
        </div>
        <div className="modal-footer">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ isResolved }) => {
  const status = isResolved ? 'Resolved' : 'Open';
  let color = isResolved ? '#2563eb' : '#059669';
  let bg = isResolved ? '#dbeafe' : '#d1fae5';
  return (
    <span
      style={{
        background: bg,
        color,
        fontWeight: 600,
        fontSize: 13,
        borderRadius: 8,
        padding: '2px 10px',
        marginLeft: 6,
      }}
    >
      {status}
    </span>
  );
};

export default ContactManagement;
