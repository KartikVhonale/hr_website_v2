import React, { useState, useEffect } from 'react';
import { getAllJobs, deleteJob, updateJob } from '../../services/adminService';
import Card from '../ui/Card.jsx';
import Button from '../ui/button.tsx';
import { FaEye, FaTrash, FaCheck, FaSearch, FaPlus } from 'react-icons/fa';
import AddJobModal from '../modal/AddJobModal';
import '../../css/AdminComponents-mobile.css';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await updateJob(jobId, { status: 'approved' });
      fetchJobs();
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleJobAdded = (newJob) => {
    fetchJobs(); // Refresh the job list
  };

  const filteredJobs = jobs.filter(j =>
    (jobStatus === 'all' || j.status === jobStatus) &&
    (j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.employer.name.toLowerCase().includes(jobSearch.toLowerCase()))
  );

  return (
    <div className="job-management">
      <Card className="dashboard-card">
        <div className="section-header">
          <h2>Job Post Management</h2>
          <div className="btn-group">
            <button
              className="btn btn-primary btn-icon"
              onClick={() => setIsAddJobModalOpen(true)}
            >
              <FaPlus /> <span>Post Job</span>
            </button>
            <button className="btn btn-secondary btn-icon">
              <FaSearch /> <span>Search Jobs</span>
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
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Status</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job._id}>
                  <td>
                    <div className="job-info">
                      <strong>{job.title}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="company-name">{job.employer.name}</div>
                  </td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td>
                    <div className="salary-info">{job.salary}</div>
                  </td>
                  <td className="actions">
                    <div className="btn-group">
                      <button className="btn btn-info btn-sm btn-icon">
                        <FaEye /> <span>View</span>
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(job._id)}>
                        <FaTrash /> <span>Delete</span>
                      </button>
                      {job.status !== 'approved' && (
                        <button className="btn btn-success btn-sm btn-icon" onClick={() => handleApprove(job._id)}>
                          <FaCheck /> <span>Approve</span>
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

      <AddJobModal
        isOpen={isAddJobModalOpen}
        onRequestClose={() => setIsAddJobModalOpen(false)}
        onJobAdded={handleJobAdded}
      />
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

export default JobManagement;
