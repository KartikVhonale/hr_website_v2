import React from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { FaEye, FaTrash, FaCheck, FaSearch } from 'react-icons/fa';

const JobManagement = ({ jobs }) => {
  const [jobSearch, setJobSearch] = React.useState('');
  const [jobStatus, setJobStatus] = React.useState('all');

  const filteredJobs = jobs.filter(j =>
    (jobStatus === 'all' || j.status === jobStatus) &&
    (j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.company.toLowerCase().includes(jobSearch.toLowerCase()))
  );

  return (
    <Card className="dashboard-card">
      <div className="section-header">
        <h2>Job Post Management</h2>
        <div className="btn-group">
          <button className="btn btn-primary btn-icon">
            <FaSearch /> Search Jobs
          </button>
        </div>
      </div>
      <div className="filter-controls">
        <input type="text" placeholder="Search jobs..." value={jobSearch} onChange={e => setJobSearch(e.target.value)} />
        <select value={jobStatus} onChange={e => setJobStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Employer</th>
              <th>Status</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map(job => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td><StatusBadge status={job.status} /></td>
                <td>{job.salary}</td>
                <td className="actions">
                  <div className="btn-group">
                    <button className="btn btn-info btn-sm btn-icon">
                      <FaEye /> View
                    </button>
                    <button className="btn btn-danger btn-sm btn-icon">
                      <FaTrash /> Delete
                    </button>
                    <button className="btn btn-success btn-sm btn-icon">
                      <FaCheck /> Approve
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

const StatusBadge = ({ status }) => {
  let color = '#64748b';
  let bg = '#e0e7ef';
  if (['active', 'approved', 'published', 'open', 'applied'].includes(status)) { color = '#059669'; bg = '#d1fae5'; }
  if (['pending', 'review', 'draft'].includes(status)) { color = '#f59e42'; bg = '#fef3c7'; }
  if (['resolved', 'selected', 'featured'].includes(status)) { color = '#2563eb'; bg = '#dbeafe'; }
  if (['rejected', 'disabled'].includes(status)) { color = '#dc2626'; bg = '#fee2e2'; }
  return <span style={{ background: bg, color, fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '2px 10px', marginLeft: 6 }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default JobManagement;
