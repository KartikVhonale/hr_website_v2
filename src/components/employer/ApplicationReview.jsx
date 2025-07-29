import React, { useState, useEffect } from 'react';
import { FileText, User, Calendar, MapPin, Briefcase, DollarSign, Clock, Star, Eye, Check, X, MessageSquare, Download, Filter, Search } from 'lucide-react';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateApplied');

  // Mock applications data
  useEffect(() => {
    const mockApplications = [
      {
        id: 1,
        candidateName: 'Sarah Johnson',
        candidateEmail: 'sarah.johnson@email.com',
        candidatePhone: '+1 (555) 123-4567',
        jobTitle: 'Senior Software Engineer',
        jobId: 'job-001',
        dateApplied: '2024-01-15',
        status: 'pending',
        rating: 4.8,
        experience: '5+ years',
        location: 'San Francisco, CA',
        expectedSalary: '$120,000 - $150,000',
        skills: ['React', 'Node.js', 'Python', 'AWS'],
        coverLetter: 'I am excited to apply for the Senior Software Engineer position. With over 5 years of experience in full-stack development...',
        resumeUrl: '/resumes/sarah-johnson.pdf',
        profileImage: '/api/placeholder/60/60',
        notes: '',
        interviewScheduled: false
      },
      {
        id: 2,
        candidateName: 'Michael Chen',
        candidateEmail: 'michael.chen@email.com',
        candidatePhone: '+1 (555) 234-5678',
        jobTitle: 'UX/UI Designer',
        jobId: 'job-002',
        dateApplied: '2024-01-12',
        status: 'approved',
        rating: 4.6,
        experience: '3+ years',
        location: 'New York, NY',
        expectedSalary: '$80,000 - $100,000',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        coverLetter: 'As a passionate UX/UI designer with 3 years of experience, I am thrilled to apply for this position...',
        resumeUrl: '/resumes/michael-chen.pdf',
        profileImage: '/api/placeholder/60/60',
        notes: 'Strong portfolio, good communication skills',
        interviewScheduled: true
      },
      {
        id: 3,
        candidateName: 'Emily Rodriguez',
        candidateEmail: 'emily.rodriguez@email.com',
        candidatePhone: '+1 (555) 345-6789',
        jobTitle: 'Data Scientist',
        jobId: 'job-003',
        dateApplied: '2024-01-10',
        status: 'rejected',
        rating: 4.2,
        experience: '4+ years',
        location: 'Austin, TX',
        expectedSalary: '$110,000 - $130,000',
        skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
        coverLetter: 'I am writing to express my interest in the Data Scientist position. My background in machine learning...',
        resumeUrl: '/resumes/emily-rodriguez.pdf',
        profileImage: '/api/placeholder/60/60',
        notes: 'Good technical skills but not the right fit for team culture',
        interviewScheduled: false
      }
    ];
    setApplications(mockApplications);
  }, []);

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus }
        : app
    ));
  };

  const handleAddNotes = (applicationId, notes) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, notes }
        : app
    ));
  };

  const handleScheduleInterview = (applicationId) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, interviewScheduled: true }
        : app
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'interviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredAndSortedApplications = applications
    .filter(app => {
      if (statusFilter === 'all') return true;
      return app.status === statusFilter;
    })
    .filter(app =>
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.candidateName.localeCompare(b.candidateName);
        case 'rating':
          return b.rating - a.rating;
        case 'dateApplied':
          return new Date(b.dateApplied) - new Date(a.dateApplied);
        default:
          return 0;
      }
    });

  const ApplicationCard = ({ application }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={application.profileImage}
            alt={application.candidateName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{application.candidateName}</h3>
            <p className="text-gray-600 dark:text-gray-300">{application.jobTitle}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          Applied: {new Date(application.dateApplied).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          {application.location}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Briefcase className="w-4 h-4 mr-2" />
          {application.experience}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-2" />
          {application.expectedSalary}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
          {application.rating}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {application.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {application.notes && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Notes:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{application.notes}</p>
        </div>
      )}

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => {
            setSelectedApplication(application);
            setShowModal(true);
          }}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Resume
        </button>
      </div>

      {application.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange(application.id, 'approved')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </button>
          <button
            onClick={() => handleStatusChange(application.id, 'rejected')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </button>
        </div>
      )}
    </div>
  );

  const ApplicationModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate Info */}
          <div className="flex items-start space-x-4">
            <img
              src={application.profileImage}
              alt={application.candidateName}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{application.candidateName}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{application.jobTitle}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{application.candidateEmail}</span>
                <span>{application.candidatePhone}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Application Information</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Applied:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{new Date(application.dateApplied).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.experience}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Expected Salary:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.expectedSalary}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                  <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.rating}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Cover Letter</h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{application.coverLetter}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Internal Notes</h4>
            <textarea
              value={application.notes}
              onChange={(e) => handleAddNotes(application.id, e.target.value)}
              placeholder="Add your notes about this candidate..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </button>
            <button
              onClick={() => handleScheduleInterview(application.id)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </button>
            {application.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    handleStatusChange(application.id, 'approved');
                    onClose();
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(application.id, 'rejected');
                    onClose();
                  }}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Review</h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {applications.length} total applications
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
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
            <option value="dateApplied">Sort by Date Applied</option>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="interviewed">Interviewed</option>
          </select>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {filteredAndSortedApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'No applications match your current filters.'
                : 'No applications have been received yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationReview;
