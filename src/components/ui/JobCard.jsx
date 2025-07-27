import React from 'react';

const JobCard = ({ title, company, location, salary }) => (
  <div className="job-card">
    <h3>{title}</h3>
    <p>{company} • {location} • {salary}</p>
    <button className="apply-btn">Apply Now</button>
  </div>
);

export default JobCard; 