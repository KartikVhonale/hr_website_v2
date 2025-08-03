import React, { useState, useEffect } from 'react';
import { employerAPI } from '../../api/index.js';
import { FileText, User, Calendar, MapPin, Briefcase, DollarSign, Clock, Star, Eye, Check, X, MessageSquare, Download, Filter, Search } from 'lucide-react';

const ApplicationReview = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateApplied');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const response = await employerAPI.getApplicationsForJob(jobId);

      console.log('ApplicationReview API response:', response);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else {
        throw new Error('Invalid API response structure');
      }

      if (apiResponse && apiResponse.success) {
        const applicationsData = apiResponse.data || [];
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        console.log('ApplicationReview: Applications loaded successfully:', applicationsData.length);
        setError(''); // Clear any previous errors
      } else {
        console.warn('ApplicationReview: API response indicates failure:', apiResponse);
        setApplications([]);
        setError(apiResponse.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('ApplicationReview: Failed to fetch applications:', err);
      setError(`Failed to fetch applications: ${err.message}`);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await employerAPI.updateApplicationStatus(applicationId, newStatus);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else {
        apiResponse = { success: true }; // Assume success if no clear structure
      }

      if (apiResponse.success !== false) {
        // Update local state immediately for better UX
        setApplications(applications.map(app =>
          app._id === applicationId
            ? { ...app, status: newStatus }
            : app
        ));
        console.log('Application status updated successfully');

        // Optionally refetch to ensure data consistency
        await fetchApplications();
      } else {
        throw new Error(apiResponse.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleAddNotes = async (applicationId, notes) => {
    try {
      // Get current application to preserve status
      const currentApp = applications.find(app => app._id === applicationId);
      const currentStatus = currentApp?.status || 'pending';

      const response = await employerAPI.updateApplicationStatus(applicationId, currentStatus, notes);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else {
        apiResponse = { success: true }; // Assume success if no clear structure
      }

      if (apiResponse.success !== false) {
        setApplications(applications.map(app =>
          app._id === applicationId
            ? { ...app, notes }
            : app
        ));
        console.log('Notes added successfully');
      } else {
        throw new Error(apiResponse.message || 'Failed to add notes');
      }
    } catch (err) {
      console.error('Failed to add notes:', err);
      setError(`Failed to add notes: ${err.message}`);
    }
  };

  const handleScheduleInterview = (applicationId) => {
    // Placeholder for scheduling interview
    console.log('Scheduling interview for application:', applicationId);
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
      (app.applicant.name && app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.job.title && app.job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.skills && app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
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
            src={application.applicant.profileImage || '/api/placeholder/60/60'}
            alt={application.applicant.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{application.applicant.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{application.job.title}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          Applied: {new Date(application.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          {application.job.location}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Briefcase className="w-4 h-4 mr-2" />
          {application.experience || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-2" />
          {application.expectedSalary || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
          {application.rating || 'N/A'}
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
            onClick={() => handleStatusChange(application._id, 'approved')}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </button>
          <button
            onClick={() => handleStatusChange(application._id, 'rejected')}
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
            src={application.applicant.profileImage || '/api/placeholder/60/60'}
            alt={application.applicant.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{application.applicant.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{application.job.title}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{application.applicant.email}</span>
              <span>{application.applicant.phone || 'N/A'}</span>
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
                  <span className="ml-2 text-gray-900 dark:text-white">{new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.job.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.experience || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Expected Salary:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.expectedSalary || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                  <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.rating || 'N/A'}</span>
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
              defaultValue={application.notes}
              onBlur={(e) => handleAddNotes(application._id, e.target.value)}
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
              onClick={() => handleScheduleInterview(application._id)}
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
                    handleStatusChange(application._id, 'approved');
                    onClose();
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(application._id, 'rejected');
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
              <ApplicationCard key={application._id} application={application} />
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
