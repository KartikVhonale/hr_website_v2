import React from 'react';
import PropTypes from 'prop-types';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import DataCard from './DataCard';
import '../../../css/Card.css';

const JobCard = ({
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

  return (
    <DataCard
      title={displayTitle}
      className={isFeatured ? 'featured-job' : ''}
      {...props}
    >
      <div className="job-details">
        <div className="company-info">
          {companyLogo && (
            <img 
              src={companyLogo} 
              alt={`${company} logo`} 
              className="company-logo"
            />
          )}
          <div className="job-company">{company}</div>
        </div>
        <div className="job-meta">
          <span className="job-location">{location}</span>
          {displayType && <span className="job-type">{displayType}</span>}
          {salary && <span className="job-salary">{salary}</span>}
        </div>
        {postedDate && <div className="job-posted">Posted: {new Date(postedDate).toLocaleDateString()}</div>}

        {description && (
          <div className="job-description">
            {description.length > 150 ? `${description.substring(0, 150)}...` : description}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="job-skills">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {skills.length > 3 && <span className="skill-more">+{skills.length - 3} more</span>}
          </div>
        )}
      </div>

      {props.children}

      {(onApply || onSave) && (
        <div className="job-actions">
          {onSave && (
            <button
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={onSave}
              disabled={loading}
              title={isSaved ? 'Remove from saved jobs' : 'Save job'}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              {/* {isSaved ? 'Saved' : 'Save Job'} */}
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
      )}
    </DataCard>
  );
};

JobCard.propTypes = {
  title: PropTypes.string,
  jobTitle: PropTypes.string,
  company: PropTypes.string.isRequired,
  companyLogo: PropTypes.string,
  location: PropTypes.string.isRequired,
  salary: PropTypes.string,
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

export default JobCard;
