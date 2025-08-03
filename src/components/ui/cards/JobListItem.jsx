import React from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, FaCalendarAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import '../../../css/JobListItem.css';

const JobListItem = ({
  title,
  jobTitle, // Support both title and jobTitle props
  company,
  companyLogo,
  location,
  salary,
  type,
  jobType, // Support both type and jobType props
  postedDate,
  description,
  skills,
  isFeatured = false,
  isSaved = false,
  onApply,
  onSave,
  loading = false,
  ...props
}) => {
  // Use jobTitle if provided, otherwise fall back to title
  const displayTitle = jobTitle || title;
  const displayType = jobType || type;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    if (typeof salary === 'string') return salary;
    return `$${salary.toLocaleString()}`;
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`job-list-item ${isFeatured ? 'featured' : ''}`} {...props}>
      <div className="job-list-content">
        {/* Left Section - Company Logo */}
        <div className="job-list-logo">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt={`${company} logo`} 
              className="company-logo"
            />
          ) : (
            <div className="company-logo-placeholder">
              <FaBuilding />
            </div>
          )}
        </div>

        {/* Middle Section - Job Details */}
        <div className="job-list-details">
          <div className="job-list-header">
            <h3 className="job-list-title">{displayTitle}</h3>
            {isFeatured && <span className="featured-badge">Featured</span>}
          </div>
          
          <div className="job-list-company">
            <FaBuilding className="icon" />
            <span>{company}</span>
          </div>

          <div className="job-list-meta">
            <div className="meta-item">
              <FaMapMarkerAlt className="icon" />
              <span>{location}</span>
            </div>
            {displayType && (
              <div className="meta-item">
                <FaClock className="icon" />
                <span>{displayType}</span>
              </div>
            )}
            {salary && (
              <div className="meta-item">
                <FaDollarSign className="icon" />
                <span>{formatSalary(salary)}</span>
              </div>
            )}
            {postedDate && (
              <div className="meta-item">
                <FaCalendarAlt className="icon" />
                <span>{formatDate(postedDate)}</span>
              </div>
            )}
          </div>

          {description && (
            <div className="job-list-description">
              <p>{truncateDescription(description)}</p>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div className="job-list-skills">
              {skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
              {skills.length > 5 && (
                <span className="skill-tag more">+{skills.length - 5} more</span>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="job-list-actions">
          <div className="action-buttons">
            {onSave && (
              <button
                className={`save-btn ${isSaved ? 'saved' : ''}`}
                onClick={onSave}
                disabled={loading}
                title={isSaved ? 'Remove from saved jobs' : 'Save job'}
              >
                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            )}
            {onApply && (
              <button
                className="apply-btn"
                onClick={onApply}
                disabled={loading}
              >
                {loading ? 'Applying...' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

JobListItem.propTypes = {
  title: PropTypes.string,
  jobTitle: PropTypes.string,
  company: PropTypes.string.isRequired,
  companyLogo: PropTypes.string,
  location: PropTypes.string.isRequired,
  salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  jobType: PropTypes.string,
  postedDate: PropTypes.string,
  description: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.string),
  isFeatured: PropTypes.bool,
  isSaved: PropTypes.bool,
  loading: PropTypes.bool,
  onApply: PropTypes.func,
  onSave: PropTypes.func,
};

export default JobListItem;
