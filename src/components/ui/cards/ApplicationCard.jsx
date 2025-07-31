import React from 'react';
import PropTypes from 'prop-types';
import DataCard from './DataCard';
import '../../../css/Card.css';

const statusColors = {
  submitted: '#4a6bff',
  reviewing: '#ffb74d',
  interviewed: '#9575cd',
  offered: '#4caf50',
  rejected: '#f44336'
};

const ApplicationCard = ({
  jobTitle,
  company,
  appliedDate,
  status,
  notes,
  onView,
  onUpdate,
  onWithdraw,
  ...props
}) => {
  return (
    <DataCard
      title={jobTitle}
      className="application-card"
      style={{ borderLeft: `4px solid ${statusColors[status] || '#ccc'}` }}
      {...props}
    >
      <div className="application-details">
        <div className="application-company">{company}</div>
        <div className="application-meta">
          <span className="application-status" style={{ color: statusColors[status] }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="application-date">Applied: {appliedDate}</span>
        </div>
        {notes && <div className="application-notes">{notes}</div>}
      </div>

      <div className="application-actions">
        {onView && (
          <button className="view-btn" onClick={onView}>
            View Details
          </button>
        )}
        {onUpdate && (
          <button className="update-btn" onClick={onUpdate}>
            Update Status
          </button>
        )}
        {onWithdraw && (
          <button className="withdraw-btn" onClick={onWithdraw}>
            Withdraw
          </button>
        )}
      </div>
    </DataCard>
  );
};

ApplicationCard.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  appliedDate: PropTypes.string.isRequired,
  status: PropTypes.oneOf([
    'submitted',
    'reviewing',
    'interviewed',
    'offered',
    'rejected'
  ]).isRequired,
  notes: PropTypes.string,
  onView: PropTypes.func,
  onUpdate: PropTypes.func,
  onWithdraw: PropTypes.func,
};

export default ApplicationCard;
