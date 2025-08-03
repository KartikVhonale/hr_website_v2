import React from 'react';
import JobCard from '../ui/cards/JobCard';

const FeaturedJobs = ({ featuredJobs }) => {
  return (
    <section className="featured-jobs-section">
      <h2>Featured Jobs</h2>
      <div className="featured-jobs-grid">
        {featuredJobs.map(job => (
          <JobCard
            key={job._id}
            jobTitle={job.title}
            company={job.employer.name}
            companyLogo={job.employer.logo}
            location={job.location}
            salary={job.salary}
            jobType={job.jobType}
            postedDate={job.createdAt}
            isFeatured={true}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedJobs;
