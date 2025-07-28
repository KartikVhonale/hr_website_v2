import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../css/ManageJobs.css';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      if (loading || !user) return;
      try {
        const response = await fetch(`/api/jobs/employer/${user._id}`);
        const data = await response.json();
        if (data.success) {
          setJobs(data.data);
        } else {
          console.error('Error fetching jobs:', data.message);
          setJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, [user, loading]);

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
                  <button>Delete</button>
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
