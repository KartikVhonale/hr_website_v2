import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { applicationsAPI } from '../../api';
import '../../css/ViewApplications.css';

const ViewApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await applicationsAPI.getApplicationsForJob(jobId);
        if (response.success) {
          setApplications(response.data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  return (
    <div className="view-applications-container">
      <div className="view-applications-header">
        <h1 className="page-title">Job Applications</h1>
      </div>
      <div className="applications-grid">
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-card-header">
                <h3 className="applicant-name">{app.applicant.name}</h3>
                <a href={`mailto:${app.applicant.email}`} className="applicant-email">{app.applicant.email}</a>
              </div>
              <div className="application-card-body">
                <p>{app.coverLetter}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No applications found for this job.</p>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;
