import React from 'react';
import Card from '../ui/card';
import Button from '../ui/button';

const Avatar = ({ name }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return (
    <div className="dashboard-avatar">{initials}</div>
  );
};

const SkillTag = ({ skill }) => (
  <span className="dashboard-skill-tag">{skill}</span>
);

const JobseekerDashboard = ({ userData }) => {
  return (
    <>
      <Card className="dashboard-card" style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Avatar name={userData.name} />
        <div>
          <div className="dashboard-label" style={{ fontSize: 18 }}>{userData.name}</div>
          <div className="dashboard-value">{userData.email}</div>
          <div className="dashboard-value">{userData.phone}</div>
        </div>
      </Card>
      <Card className="dashboard-card">
        <div className="dashboard-section-header">Resume</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <a href="#" className="dashboard-resume-link" target="_blank" rel="noopener noreferrer">
            {userData.name}_Resume.pdf
          </a>
          <Button style={{ marginLeft: 16 }} onClick={() => window.open('#', '_blank')}>Download Resume</Button>
        </div>
      </Card>
      <Card className="dashboard-card">
        <div className="dashboard-section-header">Skills</div>
        <div style={{ marginBottom: 8 }}>
          {userData.skills.map((skill) => <SkillTag key={skill} skill={skill} />)}
        </div>
      </Card>
      <Card className="dashboard-card">
        <div className="dashboard-section-header">Jobs Applied For</div>
        {/* This would be fetched from a different endpoint */}
        <div className="dashboard-empty">No jobs applied for yet.</div>
      </Card>
    </>
  );
};

export default JobseekerDashboard;
