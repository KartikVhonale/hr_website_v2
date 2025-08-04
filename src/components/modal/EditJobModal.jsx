import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { jobsAPI } from '../../api/index.js';

const EditJobModal = ({ isOpen, onRequestClose, job, onJobUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [ctc, setCtc] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Entry-level');
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // When job prop changes, populate form fields
  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setDescription(job.description || '');
      setCompany(job.company || '');
      setLocation(job.location || '');
      setCtc(job.ctc || '');
      setJobType(job.jobType || 'Full-time');
      setExperienceLevel(job.experienceLevel || 'Entry-level');
      setSkills(Array.isArray(job.skills) ? job.skills.join(', ') : '');
      setError('');
    }
  }, [job]);

  const resetForm = () => {
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        title,
        description,
        company,
        location,
        ctc,
        jobType,
        experienceLevel,
        skills: skillsArray
      };
      const response = await jobsAPI.updateJob(job._id, payload);
      if (response && response.success) {
        onJobUpdated(response.data || payload);
      } else {
        throw new Error(response.message || 'Failed to update job');
      }
      onRequestClose();
    } catch (err) {
      setError(err.message || 'Error updating job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Job Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
      style={{
        content: {
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group">
            <label>Salary *</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div> */}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CTC (in LPA) *</label>
            <input
              type="text"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Type *</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Experience Level *</label>
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} required>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Job'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditJobModal;