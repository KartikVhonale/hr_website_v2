import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import applicationsAPI from '../api/applications';
import '../css/ApplicationStatus.css';

const ApplicationStatus = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await applicationsAPI.getApplicationById(id);
        if (response.success) {
          setApplication(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!application) {
    return <div>Application not found.</div>;
  }

  return (
    <div className="application-status-page">
      <h2>Application Status</h2>
      <div className="status-card">
        <h3>{application.job.title}</h3>
        <p><strong>Company:</strong> {application.job.company}</p>
        <p><strong>Status:</strong> <span className={`status-${application.status}`}>{application.status}</span></p>
        <p><strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ApplicationStatus;
