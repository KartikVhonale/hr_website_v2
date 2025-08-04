import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../api/index.js';
import { useFormAutoSave } from '../../hooks/useFormAutoSave.js';
import Card from '../ui/Card.jsx';
import Button from '../ui/button.tsx';
import TextInput from '../ui/TextInput.jsx';
import SelectInput from '../ui/SelectInput.jsx';
import TextArea from '../ui/TextArea.jsx';
import FormGroup from '../ui/FormGroup.jsx';
import FormRow from '../ui/FormRow.jsx';

const CreateJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [ctc, setCtc] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Entry-level');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that at least one skill is added
    if (skills.length === 0) {
      setError('Please add at least one skill for this job position.');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      setError('Job title is required.');
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setError('Job description is required.');
      setLoading(false);
      return;
    }

    if (!company.trim()) {
      setError('Company name is required.');
      setLoading(false);
      return;
    }

    if (!location.trim()) {
      setError('Location is required.');
      setLoading(false);
      return;
    }

    if (!ctc.trim()) {
      setError('CTC is required.');
      setLoading(false);
      return;
    }

    try {
      // Prepare job data with proper validation
      const jobData = {
        title: title.trim(),
        description: description.trim(),
        company: company.trim(),
        location: location.trim(),
        ctc: ctc.trim(),
        jobType,
        experienceLevel,
        skills: skills.filter(skill => skill && skill.trim()) // Remove empty/null skills
      };

      // Remove any empty string fields
      Object.keys(jobData).forEach(key => {
        if (jobData[key] === '' || jobData[key] === null || jobData[key] === undefined) {
          delete jobData[key];
        }
      });

      // Ensure skills is always an array with at least one item
      if (!jobData.skills || !Array.isArray(jobData.skills) || jobData.skills.length === 0) {
        setError('Please add at least one skill for this job position.');
        setLoading(false);
        return;
      }

      console.log('Submitting job data:', JSON.stringify(jobData, null, 2));

      const response = await jobsAPI.createJob(jobData);

      console.log('CreateJob API response:', response);

      // Handle different response structures
      if (response.success) {
        console.log('Job created successfully:', response.data);

        // Navigate to employer dashboard with manage jobs tab active
        navigate('/dashboard', {
          state: {
            activeTab: 'jobs',
            successMessage: '🎉 Job posted successfully! Your job is now live and visible to candidates.',
            newJobId: response.data?._id
          }
        });
      } else {
        throw new Error(response.message || 'Failed to create job');
      }
    } catch (err) {
      console.error('Job creation error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Full error object:', JSON.stringify(err, null, 2));

      let errorMessage = 'Failed to create job. Please try again.';

      // Check different possible error structures
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Backend validation errors format
        const errorMessages = err.response.data.errors
          .filter(error => error.field && error.message) // Filter out undefined fields
          .map(error => `${error.field}: ${error.message}`)
          .join('\n');

        if (errorMessages) {
          errorMessage = `Validation errors:\n${errorMessages}`;
        }
      } else if (err.response?.data?.message) {
        // Backend error message
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // General error message
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-page">
      <main className="create-job-main-content">
        <div className="create-job-container">
          <Card className="create-job-card">
            <h1 className="create-job-title">Post a New Job</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="job-form">
              <FormRow>
                <FormGroup label="Job Title">
                  <TextInput
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup label="Company">
                  <TextInput
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup label="Location">
                  <TextInput
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup label="CTC (in LPA)">
                  <TextInput
                    id="ctc"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    required
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup label="Job Type">
                  <SelectInput
                    id="jobType"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    options={['Full-time', 'Part-time', 'Contract', 'Internship']}
                    required
                  />
                </FormGroup>
                <FormGroup label="Experience Level">
                  <SelectInput
                    id="experienceLevel"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    options={['Entry-level', 'Mid-level', 'Senior-level', 'Lead']}
                    required
                  />
                </FormGroup>
              </FormRow>
              <div className="form-group">
                <label htmlFor="skill">Skills</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <TextInput
                    id="skill"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Enter a skill (e.g. JavaScript, React, Node.js)"
                    list="skill-options"
                  />
                  <Button type="button" onClick={handleAddSkill} className="secondary-btn">
                    Add Skill
                  </Button>
                </div>
                <datalist id="skill-options">
                  <option value="JavaScript" />
                  <option value="React" />
                  <option value="Node.js" />
                  <option value="Python" />
                  <option value="Java" />
                  <option value="HTML/CSS" />
                  <option value="MongoDB" />
                  <option value="SQL" />
                  <option value="Git" />
                  <option value="AWS" />
                  <option value="Docker" />
                  <option value="TypeScript" />
                  <option value="Angular" />
                  <option value="Vue.js" />
                  <option value="PHP" />
                  <option value="C++" />
                  <option value="C#" />
                  <option value="Ruby" />
                  <option value="Go" />
                  <option value="Kubernetes" />
                </datalist>
                <div className="skills-list">
                  {skills.map(skillItem => (
                    <div key={skillItem} className="skill-tag">
                      {skillItem}
                      <button type="button" onClick={() => handleRemoveSkill(skillItem)} className="remove-skill-btn">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {skills.length === 0 && (
                  <p className="skills-help">Add at least one skill required for this job position.</p>
                )}
              </div>
              <FormGroup label="Job Description">
                <TextArea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </FormGroup>
              <Button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
