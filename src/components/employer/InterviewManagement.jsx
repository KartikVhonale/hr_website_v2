import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MapPin, User, Phone, Mail, Plus, Edit, Trash2, CheckCircle, AlertCircle, Filter, Search } from 'lucide-react';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [viewMode, setViewMode] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Mock interviews data
  useEffect(() => {
    const mockInterviews = [
      {
        id: 1,
        candidateName: 'Sarah Johnson',
        candidateEmail: 'sarah.johnson@email.com',
        candidatePhone: '+1 (555) 123-4567',
        jobTitle: 'Senior Software Engineer',
        date: '2024-02-15',
        time: '10:00 AM',
        duration: 60,
        type: 'video',
        status: 'scheduled',
        interviewer: 'John Smith',
        interviewerEmail: 'john.smith@company.com',
        location: 'Zoom Meeting',
        meetingLink: 'https://zoom.us/j/123456789',
        notes: 'Technical interview focusing on React and Node.js',
        round: 'Technical Round',
        profileImage: '/api/placeholder/60/60'
      },
      {
        id: 2,
        candidateName: 'Michael Chen',
        candidateEmail: 'michael.chen@email.com',
        candidatePhone: '+1 (555) 234-5678',
        jobTitle: 'UX/UI Designer',
        date: '2024-02-16',
        time: '2:00 PM',
        duration: 45,
        type: 'in-person',
        status: 'completed',
        interviewer: 'Jane Doe',
        interviewerEmail: 'jane.doe@company.com',
        location: 'Conference Room A',
        meetingLink: '',
        notes: 'Portfolio review and design process discussion',
        round: 'Design Review',
        profileImage: '/api/placeholder/60/60',
        feedback: 'Excellent portfolio, strong design thinking skills'
      },
      {
        id: 3,
        candidateName: 'Emily Rodriguez',
        candidateEmail: 'emily.rodriguez@email.com',
        candidatePhone: '+1 (555) 345-6789',
        jobTitle: 'Data Scientist',
        date: '2024-02-18',
        time: '11:30 AM',
        duration: 90,
        type: 'video',
        status: 'scheduled',
        interviewer: 'David Wilson',
        interviewerEmail: 'david.wilson@company.com',
        location: 'Google Meet',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Technical assessment and case study presentation',
        round: 'Final Round',
        profileImage: '/api/placeholder/60/60'
      }
    ];
    setInterviews(mockInterviews);
  }, []);

  const handleScheduleInterview = (interviewData) => {
    const newInterview = {
      id: Date.now(),
      ...interviewData,
      status: 'scheduled'
    };
    setInterviews([...interviews, newInterview]);
    setShowScheduleModal(false);
  };

  const handleUpdateInterview = (interviewId, updates) => {
    setInterviews(interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, ...updates }
        : interview
    ));
  };

  const handleDeleteInterview = (interviewId) => {
    setInterviews(interviews.filter(interview => interview.id !== interviewId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredInterviews = interviews
    .filter(interview => {
      if (viewMode === 'upcoming') {
        return interview.status === 'scheduled' && new Date(interview.date) >= new Date();
      } else if (viewMode === 'completed') {
        return interview.status === 'completed';
      } else if (viewMode === 'all') {
        return true;
      }
      return true;
    })
    .filter(interview => {
      if (filterBy === 'all') return true;
      return interview.type === filterBy;
    })
    .filter(interview =>
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const InterviewCard = ({ interview }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={interview.profileImage}
            alt={interview.candidateName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{interview.candidateName}</h3>
            <p className="text-gray-600 dark:text-gray-300">{interview.jobTitle}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{interview.round}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(interview.date).toLocaleDateString()} at {interview.time}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          {interview.duration} minutes
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          {getTypeIcon(interview.type)}
          <span className="ml-2">{interview.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4 mr-2" />
          Interviewer: {interview.interviewer}
        </div>
      </div>

      {interview.notes && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Notes:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{interview.notes}</p>
        </div>
      )}

      {interview.feedback && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Feedback:</p>
          <p className="text-sm text-green-700 dark:text-green-300">{interview.feedback}</p>
        </div>
      )}

      <div className="flex space-x-2">
        {interview.status === 'scheduled' && (
          <>
            <button
              onClick={() => handleUpdateInterview(interview.id, { status: 'completed' })}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </button>
            <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          </>
        )}
        {interview.meetingLink && (
          <button
            onClick={() => window.open(interview.meetingLink, '_blank')}
            className="flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <Video className="w-4 h-4 mr-2" />
            Join
          </button>
        )}
        <button
          onClick={() => handleDeleteInterview(interview.id)}
          className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const ScheduleModal = ({ onClose, onSchedule }) => {
    const [formData, setFormData] = useState({
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      jobTitle: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      interviewer: '',
      interviewerEmail: '',
      location: '',
      meetingLink: '',
      notes: '',
      round: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSchedule(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule Interview</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.candidateName}
                  onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Candidate Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.candidateEmail}
                  onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Candidate Phone
                </label>
                <input
                  type="tel"
                  value={formData.candidatePhone}
                  onChange={(e) => setFormData({...formData, candidatePhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  max="180"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interview Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interview Round
                </label>
                <input
                  type="text"
                  placeholder="e.g., Technical Round, HR Round"
                  value={formData.round}
                  onChange={(e) => setFormData({...formData, round: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interviewer
                </label>
                <input
                  type="text"
                  required
                  value={formData.interviewer}
                  onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interviewer Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.interviewerEmail}
                  onChange={(e) => setFormData({...formData, interviewerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location / Meeting Link
              </label>
              <input
                type="text"
                placeholder="Conference room or video call link"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Interview focus, preparation notes, etc."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows="3"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Management</h2>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Interview
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('upcoming')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'upcoming'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewMode('completed')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'completed'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="video">Video Calls</option>
            <option value="phone">Phone Calls</option>
            <option value="in-person">In Person</option>
          </select>
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No interviews found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterBy !== 'all' 
                ? 'No interviews match your current filters.'
                : 'No interviews have been scheduled yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleInterview}
        />
      )}
    </div>
  );
};

export default InterviewManagement;
