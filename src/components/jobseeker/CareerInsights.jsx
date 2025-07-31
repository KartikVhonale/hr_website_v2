import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaArrowUp, 
  FaDollarSign,
  FaMapMarkerAlt,
  FaUsers,
  FaLightbulb,
  FaGraduationCap,
  FaBriefcase,
  FaSpinner
} from 'react-icons/fa';
import '../../css/CareerInsights.css';

const CareerInsights = () => {
  const [selectedCategory, setSelectedCategory] = useState('salary');
  const [loading, setLoading] = useState(false);
  const [insightsData, setInsightsData] = useState(null);

  const insights = {
    salary: {
      title: 'Salary Insights',
      icon: FaDollarSign,
      data: [
        { role: 'Frontend Developer', avgSalary: '$85,000', growth: '+5%' },
        { role: 'Full Stack Developer', avgSalary: '$95,000', growth: '+8%' },
        { role: 'UI/UX Designer', avgSalary: '$75,000', growth: '+3%' }
      ]
    },
    trends: {
      title: 'Market Trends',
      icon: FaArrowUp,
      data: [
        { skill: 'React', demand: 'High', growth: '+12%' },
        { skill: 'TypeScript', demand: 'Growing', growth: '+25%' },
        { skill: 'Node.js', demand: 'Stable', growth: '+7%' }
      ]
    },
    locations: {
      title: 'Top Locations',
      icon: FaMapMarkerAlt,
      data: [
        { city: 'San Francisco', jobs: 1250, avgSalary: '$120,000' },
        { city: 'New York', jobs: 980, avgSalary: '$110,000' },
        { city: 'Seattle', jobs: 750, avgSalary: '$105,000' }
      ]
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would call an API to fetch insights data
      // For now, we'll just simulate the data fetch
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInsightsData(insights);
    } catch (err) {
      console.error('Failed to fetch insights data:', err);
      setInsightsData(insights); // Use mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-insights-section">
      <div className="insights-header">
        <div className="header-content">
          <h2>Career Insights</h2>
          <p>Stay informed about market trends and opportunities</p>
        </div>
      </div>

      <div className="insights-categories">
        {Object.entries(insights).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <button
              key={key}
              className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              <IconComponent />
              {category.title}
            </button>
          );
        })}
      </div>

      <div className="insights-content">
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading career insights...</p>
          </div>
        ) : (
          <div className="insights-placeholder">
            <FaChartLine className="placeholder-icon" />
            <h3>Career Insights Coming Soon</h3>
            <p>We're developing comprehensive career insights including:</p>
            <div className="features-list">
              <div className="feature-item">
                <FaDollarSign />
                <span>Real-time salary data and trends</span>
              </div>
              <div className="feature-item">
                <FaArrowUp />
                <span>Skills demand analysis</span>
              </div>
              <div className="feature-item">
                <FaMapMarkerAlt />
                <span>Geographic job market insights</span>
              </div>
              <div className="feature-item">
                <FaUsers />
                <span>Industry growth projections</span>
              </div>
              <div className="feature-item">
                <FaLightbulb />
                <span>Personalized career recommendations</span>
              </div>
              <div className="feature-item">
                <FaGraduationCap />
                <span>Learning path suggestions</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerInsights;
