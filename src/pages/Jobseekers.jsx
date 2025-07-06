import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import JobCard from '../components/ui/JobCard';
import BlogCard from '../components/ui/BlogCard';
import useScrollAnimation from '../lib/useScrollAnimation';

const jobs = [
  {
    title: 'Frontend Developer',
    company: 'BlueTech',
    location: 'Remote',
    salary: '$80k-$110k',
  },
  {
    title: 'UI/UX Designer',
    company: 'Designify',
    location: 'New York, NY',
    salary: '$70k-$95k',
  },
  {
    title: 'Data Analyst',
    company: 'InsightWorks',
    location: 'San Francisco, CA',
    salary: '$90k-$120k',
  },
];

const blogs = [
  {
    title: 'How to Ace Your Technical Interview',
    excerpt: 'Master the art of technical interviews with our comprehensive guide covering coding challenges, system design, and behavioral questions.',
    author: 'Sarah Johnson',
    date: 'Dec 15, 2024',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop',
    category: 'Career Tips'
  },
  {
    title: 'Building a Strong Professional Network',
    excerpt: 'Learn effective strategies to build and maintain professional relationships that can advance your career and open new opportunities.',
    author: 'Michael Chen',
    date: 'Dec 12, 2024',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    category: 'Networking'
  },
  {
    title: 'Remote Work Best Practices',
    excerpt: 'Discover proven strategies to stay productive, maintain work-life balance, and thrive in remote work environments.',
    author: 'Emily Rodriguez',
    date: 'Dec 10, 2024',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop',
    category: 'Remote Work'
  },
  {
    title: 'Resume Writing Secrets That Get You Hired',
    excerpt: 'Transform your resume with expert tips on formatting, keyword optimization, and highlighting your achievements effectively.',
    author: 'David Kim',
    date: 'Dec 8, 2024',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    category: 'Resume Tips'
  }
];

const Jobseekers = () => {
  const navigate = useNavigate();
  const heroRef = useRef();
  const featuredRef = useRef();
  const blogsRef = useRef();
  useScrollAnimation(heroRef);
  useScrollAnimation(featuredRef);
  useScrollAnimation(blogsRef);

  const handleViewAllArticles = () => {
    navigate('/articles');
  };

  return (
    <div className="jobseekers-page">
      <section className="jobseekers-hero" ref={heroRef}>
        <h1 className="jobseekers-title">Find Your Next Opportunity</h1>
        <p className="jobseekers-desc">Discover jobs tailored to your skills and interests. Apply in one click and take the next step in your career with TalentFlow.</p>
        <button className="jobseekers-cta">Browse Jobs</button>
      </section>
      
      <section className="jobseekers-featured" ref={featuredRef}>
        <h2 className="featured-title">Featured Jobs</h2>
        <div className="featured-jobs-list">
          {jobs.map((job, idx) => (
            <JobCard
              key={idx}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
            />
          ))}
        </div>
      </section>

      <section className="jobseekers-blogs" ref={blogsRef}>
        <h2 className="blogs-title">Career Insights & Tips</h2>
        <p className="blogs-subtitle">Stay ahead in your career with expert advice and industry insights</p>
        <div className="blogs-grid">
          {blogs.map((blog, idx) => (
            <BlogCard
              key={idx}
              title={blog.title}
              excerpt={blog.excerpt}
              author={blog.author}
              date={blog.date}
              readTime={blog.readTime}
              image={blog.image}
              category={blog.category}
            />
          ))}
        </div>
        <div className="blogs-cta">
          <button className="blogs-view-all" onClick={handleViewAllArticles}>View All Articles</button>
        </div>
      </section>
    </div>
  );
};

export default Jobseekers; 