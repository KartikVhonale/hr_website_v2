import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaVideo,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
  FaUser,
  FaEdit,
  FaPlus,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const InterviewSchedule = ({ interviews, setInterviews }) => {
  const [selectedView, setSelectedView] = useState('upcoming'); // upcoming, past, all
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Mock interview data
  const mockInterviews = [
    {
      _id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      interviewer: 'Sarah Johnson',
      interviewerRole: 'Engineering Manager',
      date: '2024-01-25',
      time: '14:00',
      duration: 60,
      type: 'video', // video, phone, in-person
      location: 'Zoom Meeting',
      status: 'scheduled',
      round: 1,
      totalRounds: 3,
      notes: 'Technical interview focusing on React and JavaScript',
      preparation: ['Review React hooks', 'Practice coding challenges', 'Prepare questions about team'],
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      _id: '2',
      jobTitle: 'UX Designer',
      company: 'Design Studio',
      interviewer: 'Mike Chen',
      interviewerRole: 'Design Director',
      date: '2024-01-28',
      time: '10:30',
      duration: 45,
      type: 'in-person',
      location: '123 Design Ave, New York, NY',
      status: 'scheduled',
      round: 2,
      totalRounds: 2,
      notes: 'Portfolio review and design process discussion',
      preparation: ['Prepare portfolio presentation', 'Research company projects', 'Bring printed portfolio'],
      address: '123 Design Ave, Suite 500, New York, NY 10001'
    },
    {
      _id: '3',
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      interviewer: 'Lisa Wang',
      interviewerRole: 'VP of Product',
      date: '2024-01-20',
      time: '15:00',
      duration: 30,
      type: 'phone',
      location: 'Phone Interview',
      status: 'completed',
      round: 1,
      totalRounds: 2,
      notes: 'Initial screening call',
      preparation: ['Research company products', 'Prepare STAR examples'],
      feedback: 'Positive feedback, moving to next round'
    }
  ];

  const [displayInterviews, setDisplayInterviews] = useState(mockInterviews);

  const getInterviewIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo className="interview-type-icon video" />;
      case 'phone':
        return <FaPhone className="interview-type-icon phone" />;
      case 'in-person':
        return <FaMapMarkerAlt className="interview-type-icon in-person" />;
      default:
        return <FaCalendarAlt className="interview-type-icon" />;
    }
  };

  const getStatusBadge = (status, date, time) => {
    const interviewDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const timeDiff = interviewDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (status === 'completed') {
      return <span className="status-badge completed">Completed</span>;
    } else if (status === 'cancelled') {
      return <span className="status-badge cancelled">Cancelled</span>;
    } else if (hoursDiff < 0) {
      return <span className="status-badge missed">Missed</span>;
    } else if (hoursDiff < 24) {
      return <span className="status-badge urgent">Today</span>;
    } else if (hoursDiff < 48) {
      return <span className="status-badge soon">Tomorrow</span>;
    } else {
      return <span className="status-badge scheduled">Scheduled</span>;
    }
  };

  const filterInterviews = (interviews, view) => {
    const now = new Date();
    switch (view) {
      case 'upcoming':
        return interviews.filter(interview => {
          const interviewDate = new Date(`${interview.date}T${interview.time}`);
          return interviewDate >= now && interview.status === 'scheduled';
        });
      case 'past':
        return interviews.filter(interview => {
          const interviewDate = new Date(`${interview.date}T${interview.time}`);
          return interviewDate < now || interview.status === 'completed';
        });
      default:
        return interviews;
    }
  };

  const filteredInterviews = filterInterviews(displayInterviews, selectedView);

  const InterviewModal = ({ interview, onClose }) => {
    if (!interview) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="interview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{interview.jobTitle}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="modal-content">
            <div className="interview-details">
              <div className="detail-section">
                <h4>Interview Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Company</label>
                    <span>{interview.company}</span>
                  </div>
                  <div className="detail-item">
                    <label>Interviewer</label>
                    <span>{interview.interviewer} - {interview.interviewerRole}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date & Time</label>
                    <span>{new Date(`${interview.date}T${interview.time}`).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration</label>
                    <span>{interview.duration} minutes</span>
                  </div>
                  <div className="detail-item">
                    <label>Round</label>
                    <span>{interview.round} of {interview.totalRounds}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type</label>
                    <span className="interview-type">
                      {getInterviewIcon(interview.type)}
                      {interview.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Location/Meeting Details</h4>
                <div className="location-info">
                  <p>{interview.location}</p>
                  {interview.meetingLink && (
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                      Join Meeting
                    </a>
                  )}
                  {interview.address && (
                    <p className="address">{interview.address}</p>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Notes</h4>
                <p>{interview.notes}</p>
              </div>

              <div className="detail-section">
                <h4>Preparation Checklist</h4>
                <div className="preparation-list">
                  {interview.preparation.map((item, index) => (
                    <div key={index} className="preparation-item">
                      <input type="checkbox" id={`prep-${index}`} />
                      <label htmlFor={`prep-${index}`}>{item}</label>
                    </div>
                  ))}
                </div>
              </div>

              {interview.feedback && (
                <div className="detail-section">
                  <h4>Feedback</h4>
                  <p>{interview.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="interview-schedule-section">
      <div className="schedule-header">
        <div className="header-content">
          <h2>Interview Schedule</h2>
          <p>Manage your upcoming and past interviews</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{filterInterviews(displayInterviews, 'upcoming').length}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{displayInterviews.filter(i => i.status === 'completed').length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="schedule-controls">
        <div className="view-tabs">
          <button 
            className={`tab-btn ${selectedView === 'upcoming' ? 'active' : ''}`}
            onClick={() => setSelectedView('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`tab-btn ${selectedView === 'past' ? 'active' : ''}`}
            onClick={() => setSelectedView('past')}
          >
            Past
          </button>
          <button 
            className={`tab-btn ${selectedView === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedView('all')}
          >
            All
          </button>
        </div>
      </div>

      <div className="interviews-list">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => (
            <div key={interview._id} className={`interview-card ${interview.status}`}>
              <div className="interview-header">
                <div className="interview-info">
                  <div className="job-info">
                    <h4 className="job-title">{interview.jobTitle}</h4>
                    <div className="company-info">
                      <FaBuilding className="company-icon" />
                      <span className="company-name">{interview.company}</span>
                    </div>
                  </div>
                  <div className="interview-meta">
                    {getStatusBadge(interview.status, interview.date, interview.time)}
                    <span className="round-info">Round {interview.round}/{interview.totalRounds}</span>
                  </div>
                </div>
              </div>

              <div className="interview-content">
                <div className="interview-details">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>{new Date(interview.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span>{interview.time} ({interview.duration} min)</span>
                  </div>
                  <div className="detail-item">
                    {getInterviewIcon(interview.type)}
                    <span>{interview.location}</span>
                  </div>
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <span>{interview.interviewer}</span>
                  </div>
                </div>
                
                <p className="interview-notes">{interview.notes}</p>
              </div>

              <div className="interview-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => setSelectedInterview(interview)}
                >
                  View Details
                </button>
                {interview.status === 'scheduled' && (
                  <>
                    <button className="action-btn edit-btn">
                      <FaEdit />
                      Edit
                    </button>
                    {interview.meetingLink && (
                      <a 
                        href={interview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-btn join-btn"
                      >
                        Join Meeting
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-interviews">
            <div className="empty-icon">
              <FaCalendarAlt />
            </div>
            <h3>No interviews {selectedView === 'all' ? '' : selectedView}</h3>
            <p>
              {selectedView === 'upcoming' 
                ? "You don't have any upcoming interviews scheduled."
                : selectedView === 'past'
                ? "No past interviews found."
                : "No interviews found."
              }
            </p>
            {selectedView === 'upcoming' && (
              <button 
                className="browse-jobs-btn"
                onClick={() => window.location.href = '#job-search'}
              >
                Apply to Jobs
              </button>
            )}
          </div>
        )}
      </div>

      {selectedInterview && (
        <InterviewModal 
          interview={selectedInterview} 
          onClose={() => setSelectedInterview(null)} 
        />
      )}
    </div>
  );
};

export default InterviewSchedule;
