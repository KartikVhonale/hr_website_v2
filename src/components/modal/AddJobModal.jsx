import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';

const AddJobModal = ({ isOpen, onRequestClose, onJobAdded }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [ctc, setCtc] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Entry-level');
  const [skills, setSkills] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCompany('');
    setLocation('');
    setSalary('');
    setCtc('');
    setJobType('Full-time');
    setExperienceLevel('Entry-level');
    setSkills('');
    setEmployerEmail('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          company,
          location,
          salary,
          ctc,
          jobType,
          experienceLevel,
          skills: skillsArray,
          employerEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job');
      }

      setSuccess('Job posted successfully!');
      onJobAdded(data);
      setTimeout(() => {
        onRequestClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Add Job Modal"
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
      <h2>Post New Job</h2>
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
              placeholder="e.g. Tech Corp"
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
              placeholder="e.g. New York, NY"
            />
          </div>
          <div className="form-group">
            <label>Employer Email *</label>
            <input
              type="email"
              value={employerEmail}
              onChange={(e) => setEmployerEmail(e.target.value)}
              required
              placeholder="employer@company.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Salary *</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              placeholder="e.g. $80,000 - $120,000"
            />
          </div>
          <div className="form-group">
            <label>CTC (in LPA) *</label>
            <input
              type="text"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              required
              placeholder="e.g. 12-18 LPA"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Job Type *</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="form-group">
            <label>Experience Level *</label>
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} required>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Skills (comma-separated) *</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            placeholder="e.g. JavaScript, React, Node.js, MongoDB"
          />
        </div>

        <div className="form-group">
          <label>Job Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            placeholder="Describe the job responsibilities, requirements, and benefits..."
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal;
