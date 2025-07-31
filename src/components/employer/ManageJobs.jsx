import React, { useState, useEffect } from 'react';
import { getPostedJobs, deleteJob } from '../../services/employerService';
import '../../css/ManageJobs.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getPostedJobs();
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
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

  return (
    <div className="manage-jobs-page">
      <div className="manage-jobs-container">
        <h1>Manage Jobs</h1>
        <div className="job-list">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="job-item">
                <h2>{job.title}</h2>
                <p>{job.company}</p>
                <p>{job.location}</p>
                <div className="job-actions">
                  <button>Edit</button>
                  <button onClick={() => handleDelete(job._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>You have not posted any jobs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
