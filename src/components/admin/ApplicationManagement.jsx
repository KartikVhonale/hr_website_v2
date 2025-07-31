import React from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/button.tsx';
import { FaEye, FaSyncAlt, FaSearch } from 'react-icons/fa';
import '../../css/AdminComponents-mobile.css';

const ApplicationManagement = ({ applications }) => {
  const [appSearch, setAppSearch] = React.useState('');
  const [appStatus, setAppStatus] = React.useState('all');

  const filteredApplications = applications.filter(a =>
    (appStatus === 'all' || a.status === appStatus) &&
    (a.job.title.toLowerCase().includes(appSearch.toLowerCase()) || a.applicant.name.toLowerCase().includes(appSearch.toLowerCase()))
  );

  return (
    <div className="application-management">
      <Card className="dashboard-card">
        <div className="section-header">
          <h2>Application Tracker</h2>
          <div className="btn-group">
            <button className="btn btn-primary btn-icon">
              <FaSearch /> <span>Search Applications</span>
            </button>
          </div>
        </div>
      <div className="filter-controls">
        <input type="text" placeholder="Search applications..." value={appSearch} onChange={e => setAppSearch(e.target.value)} />
        <select value={appStatus} onChange={e => setAppStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="review">Review</option>
        </select>
      </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Position</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app._id}>
                  <td>
                    <div className="job-info">
                      <strong>{app.job.title}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="applicant-info">
                      <strong>{app.applicant.name}</strong>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="actions">
                    <div className="btn-group">
                      <button className="btn btn-info btn-sm btn-icon">
                        <FaEye /> <span>View</span>
                      </button>
                      <button className="btn btn-warning btn-sm btn-icon">
                        <FaSyncAlt /> <span>Update</span>
                      </button>
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
  if (['active', 'approved', 'published', 'open', 'applied'].includes(status)) { color = '#059669'; bg = '#d1fae5'; }
  if (['pending', 'review', 'draft'].includes(status)) { color = '#f59e42'; bg = '#fef3c7'; }
  if (['resolved', 'selected', 'featured'].includes(status)) { color = '#2563eb'; bg = '#dbeafe'; }
  if (['rejected', 'disabled'].includes(status)) { color = '#dc2626'; bg = '#fee2e2'; }
  return <span style={{ background: bg, color, fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '2px 10px', marginLeft: 6 }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default ApplicationManagement;
