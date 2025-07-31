import React, { useState, useEffect } from 'react';
import { getSavedCandidates, unsaveCandidate } from '../../services/employerService';
import { Heart, Search, Filter, MapPin, Briefcase, DollarSign, Clock, Star, Eye, Send, Trash2, Grid, List } from 'lucide-react';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedCandidates();
  }, []);

  const fetchSavedCandidates = async () => {
    setLoading(true);
    try {
      const res = await getSavedCandidates();
      setSavedCandidates(res.data);
    } catch (err) {
      setError('Failed to fetch saved candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      await unsaveCandidate(candidateId);
      fetchSavedCandidates();
    } catch (err) {
      console.error('Failed to remove candidate', err);
    }
  };

  const handleContactCandidate = async (candidateId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update-candidate-status/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'contacted' }),
      });
      const data = await response.json();
      if (data.success) {
        setSavedCandidates(savedCandidates.map(candidate => 
          candidate._id === candidateId 
            ? { ...candidate, status: 'contacted' }
            : candidate
        ));
      }
    } catch (err) {
      console.error('Failed to update candidate status', err);
    }
  };

  const handleUpdateNotes = async (candidateId, notes) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update-candidate-notes/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();
      if (data.success) {
        setSavedCandidates(savedCandidates.map(candidate => 
          candidate._id === candidateId 
            ? { ...candidate, notes }
            : candidate
        ));
      }
    } catch (err) {
      console.error('Failed to update candidate notes', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'interviewed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredAndSortedCandidates = savedCandidates
    .filter(candidate => {
      if (filterBy === 'all') return true;
      return candidate.status === filterBy;
    })
    .filter(candidate =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'dateAdded':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        default:
          return 0;
      }
    });

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
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </span>
            <button
              onClick={() => handleRemoveCandidate(candidate._id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
            <Trash2 className="w-4 h-4" />
          </button>
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
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
          {candidate.rating}
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

      {candidate.notes && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Notes:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{candidate.notes}</p>
        </div>
      )}

      <div className="flex space-x-2">
        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          <Eye className="w-4 h-4 mr-2" />
          View Profile
        </button>
        <button
          onClick={() => handleContactCandidate(candidate._id)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Send className="w-4 h-4 mr-2" />
          Contact
        </button>
      </div>

      <div className="mt-4">
        <textarea
          placeholder="Add notes about this candidate..."
          value={candidate.notes || ''}
          onChange={(e) => handleUpdateNotes(candidate._id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          rows="2"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Candidates</h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {savedCandidates.length} candidates saved
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search saved candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="dateAdded">Sort by Date Added</option>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {filteredAndSortedCandidates.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved candidates</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterBy !== 'all' 
                ? 'No candidates match your current filters.'
                : 'Start saving candidates to build your talent pipeline.'}
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredAndSortedCandidates.map((candidate) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCandidates;
