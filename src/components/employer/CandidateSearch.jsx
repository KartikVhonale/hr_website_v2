import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase, DollarSign, Clock, Star, Eye, Heart, Send } from 'lucide-react';

const CandidateSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: '',
    salary: '',
    availability: ''
  });
  const [candidates, setCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock candidate data
  useEffect(() => {
    const mockCandidates = [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        experience: '5+ years',
        skills: ['React', 'Node.js', 'Python', 'AWS'],
        expectedSalary: '$120,000 - $150,000',
        availability: 'Immediate',
        rating: 4.8,
        profileImage: '/api/placeholder/60/60',
        summary: 'Experienced full-stack developer with expertise in modern web technologies...'
      },
      {
        id: 2,
        name: 'Michael Chen',
        title: 'UX/UI Designer',
        location: 'New York, NY',
        experience: '3+ years',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        expectedSalary: '$80,000 - $100,000',
        availability: '2 weeks notice',
        rating: 4.6,
        profileImage: '/api/placeholder/60/60',
        summary: 'Creative designer focused on user-centered design principles...'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        title: 'Data Scientist',
        location: 'Austin, TX',
        experience: '4+ years',
        skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
        expectedSalary: '$110,000 - $130,000',
        availability: '1 month notice',
        rating: 4.9,
        profileImage: '/api/placeholder/60/60',
        summary: 'Data scientist with strong background in machine learning and analytics...'
      }
    ];
    setCandidates(mockCandidates);
  }, []);

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching for:', searchQuery, filters);
  };

  const handleSaveCandidate = (candidateId) => {
    if (savedCandidates.includes(candidateId)) {
      setSavedCandidates(savedCandidates.filter(id => id !== candidateId));
    } else {
      setSavedCandidates([...savedCandidates, candidateId]);
    }
  };

  const handleContactCandidate = (candidateId) => {
    console.log('Contacting candidate:', candidateId);
    // Implement contact logic
  };

  const CandidateCard = ({ candidate }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={candidate.profileImage}
            alt={candidate.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{candidate.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{candidate.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{candidate.rating}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          {candidate.location}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Briefcase className="w-4 h-4 mr-2" />
          {candidate.experience}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-2" />
          {candidate.expectedSalary}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          {candidate.availability}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{candidate.summary}</p>

      <div className="flex space-x-2">
        <button
          onClick={() => handleSaveCandidate(candidate.id)}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            savedCandidates.includes(candidate.id)
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Heart className={`w-4 h-4 mr-2 ${savedCandidates.includes(candidate.id) ? 'fill-current' : ''}`} />
          {savedCandidates.includes(candidate.id) ? 'Saved' : 'Save'}
        </button>
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </button>
        <button
          onClick={() => handleContactCandidate(candidate.id)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Send className="w-4 h-4 mr-2" />
          Contact
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Find Candidates</h2>
        
        {/* Search Bar */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skills, title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Any</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
                <option value="executive">Executive Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills</label>
              <input
                type="text"
                placeholder="Required skills"
                value={filters.skills}
                onChange={(e) => setFilters({...filters, skills: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Range</label>
              <select
                value={filters.salary}
                onChange={(e) => setFilters({...filters, salary: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Any</option>
                <option value="0-50k">$0 - $50,000</option>
                <option value="50k-80k">$50,000 - $80,000</option>
                <option value="80k-120k">$80,000 - $120,000</option>
                <option value="120k+">$120,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Any</option>
                <option value="immediate">Immediate</option>
                <option value="2weeks">2 weeks notice</option>
                <option value="1month">1 month notice</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {candidates.length} Candidates Found
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              List
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;
