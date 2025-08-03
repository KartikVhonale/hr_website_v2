import React, { useState, useEffect } from 'react';
import JobSearch from '../components/jobseeker/JobSearch';
import FeaturedJobs from '../components/jobseeker/FeaturedJobs';
import { jobsAPI } from '../api/index.js';
import { useAuth } from '../context/AuthContext';
import '../css/JobPortal.css';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobCategories, setJobCategories] = useState([
    { id: 1, name: 'Technology', count: 0 },
    { id: 2, name: 'Healthcare', count: 0 },
    { id: 3, name: 'Finance', count: 0 },
    { id: 4, name: 'Education', count: 0 },
    { id: 5, name: 'Marketing', count: 0 },
    { id: 6, name: 'Engineering', count: 0 },
    { id: 7, name: 'coming soon ...', count: 100},
  ]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsAPI.getAllJobs();

        console.log('JobPortal API response:', response);

        // Handle the response structure: { data: { success: true, data: [...] } }
        let jobs = [];
        if (response && response.data && response.data.success) {
          jobs = response.data.data || [];
        } else if (response && Array.isArray(response.data)) {
          // Fallback for direct array response
          jobs = response.data;
        } else if (response && Array.isArray(response)) {
          // Fallback for direct array response
          jobs = response;
        }

        console.log('Processed jobs:', jobs);

        // Ensure jobs is an array
        if (!Array.isArray(jobs)) {
          console.warn('Jobs is not an array:', jobs);
          jobs = [];
        }

        setJobs(jobs);

        // Mark first 3 jobs as featured
        const featured = jobs.slice(0, 3).map(job => ({
          ...job,
          isFeatured: true,
          companyLogo: job.employer?.logo || 'https://via.placeholder.com/40'
        }));
        setFeaturedJobs(featured);

        // Update category counts
        setJobCategories(prevCategories =>
          prevCategories.map(category => ({
            ...category,
            count: jobs.filter(job => job.category === category.name).length
          }))
        );
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setJobs([]);
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="job-portal-page">
      <h1 className="page-title">Job Portal</h1>
      <div className="portal-description">
        Browse through our latest job openings and find your perfect match
      </div>
      <JobSearch />


      {/* Job Categories Section */}
      <section className="job-categories">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          {jobCategories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.name}</h3>
              <p>{category.count} jobs available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && <FeaturedJobs featuredJobs={featuredJobs} />}
    </div>
  );
};

export default JobPortal;
