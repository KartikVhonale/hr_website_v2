import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
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
          ctc,
          jobType,
          experienceLevel,
          skills: skills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
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
