import React, { useState, useEffect } from 'react';
import { employerAPI } from '../../api/index.js';
import { FileText, User, Calendar, MapPin, Briefcase, DollarSign, Clock, Star, Eye, Check, X, MessageSquare, Download, Filter, Search } from 'lucide-react';

const AllApplicationsReview = ({ applications: propApplications, loading: propLoading, error: propError }) => {
  const [applications, setApplications] = useState(propApplications || []);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateApplied');
  const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : true);
  const [error, setError] = useState(propError || '');
  const [successMessage, setSuccessMessage] = useState(''); // Added success message state

  // Update local state when props change
  useEffect(() => {
    if (propApplications !== undefined) {
      setApplications(propApplications);
    }
    if (propLoading !== undefined) {
      setLoading(propLoading);
    }
    if (propError !== undefined) {
      setError(propError);
    }
  }, [propApplications, propLoading, propError]);

  // If no applications were passed via props, fetch them
  useEffect(() => {
    if (propApplications === undefined) {
      fetchAllApplications();
    }
  }, []);

  const fetchAllApplications = async () => {
    if (propApplications !== undefined) return; // Don't fetch if props are provided
    
    setLoading(true);
    try {
      const response = await employerAPI.getAllApplications();

      console.log('AllApplicationsReview API response:', response);

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
        console.log('AllApplicationsReview: Applications loaded successfully:', applicationsData.length);
        setError(''); // Clear any previous errors
      } else {
        console.warn('AllApplicationsReview: API response indicates failure:', apiResponse);
        setApplications([]);
        setError(apiResponse.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('AllApplicationsReview: Failed to fetch applications:', err);
      setError(`Failed to fetch applications: ${err.message}`);
      setApplications([]);
    } finally {
      if (propLoading === undefined) {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    // If the application is already in the desired state, don't proceed
    const currentApplication = applications.find(app => app._id === applicationId);
    if (currentApplication && currentApplication.status === newStatus) {
      setSuccessMessage(`Application is already ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    
    // Show confirmation dialog for changing status
    const currentStatus = currentApplication ? currentApplication.status : 'unknown';
    const action = newStatus === 'approved' ? 'accept' : 'reject';
    const confirmed = window.confirm(`Are you sure you want to ${action} this application? Current status: ${currentStatus}`);
    
    if (!confirmed) {
      return; // User cancelled the action
    }
    
    try {
      const response = await employerAPI.updateApplicationStatus(applicationId, newStatus);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else if (response._id) {
        // Direct response from backend
        apiResponse = { success: true, data: response };
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
        
        // Show success message
        const action = newStatus === 'approved' ? 'accepted' : 'rejected';
        setSuccessMessage(`Application ${action} successfully`);
        setError(''); // Clear any previous error
        setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        
        // Close modal if it's open and showing this application
        if (selectedApplication && selectedApplication._id === applicationId) {
          setShowModal(false);
          setSelectedApplication(null);
        }
        
        // Optionally refetch to ensure data consistency
        // await fetchAllApplications(); // Commented out to avoid unnecessary refetch
      } else {
        throw new Error(apiResponse.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(`Failed to update status: ${err.message}`);
      setSuccessMessage(''); // Clear any previous success message
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    }
  };

  const handleAddNotes = async (applicationId, notes) => {
    try {
      // Get current application to preserve status
      const currentApp = applications.find(app => app._id === applicationId);
      const currentStatus = currentApp?.status || 'applied';

      const response = await employerAPI.updateApplicationStatus(applicationId, currentStatus, notes);

      // Handle different response structures
      let apiResponse;
      if (response.data) {
        apiResponse = response.data;
      } else if (response.success !== undefined) {
        apiResponse = response;
      } else if (response._id) {
        // Direct response from backend
        apiResponse = { success: true, data: response };
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
      (app.applicant.email && app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          // Use applicant name for sorting
          const nameA = a.applicant?.name || '';
          const nameB = b.applicant?.name || '';
          return nameA.localeCompare(nameB);
        case 'dateApplied':
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
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
          <User className="w-4 h-4 mr-2" />
          {application.applicant.phone || 'No phone provided'}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(application.applicant.skills) ? application.applicant.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
            >
              {skill}
            </span>
          )) : (
            <span className="text-gray-500 text-sm">No skills listed</span>
          )}
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

      {/* Always visible Accept/Reject buttons */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
        {application.status === 'pending' ? (
          <>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Action Required</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange(application._id, 'approved')}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors shadow-md"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </button>
              <button
                onClick={() => handleStatusChange(application._id, 'rejected')}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors shadow-md"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange(application._id, 'approved')}
              disabled={application.status === 'approved'}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-md ${
                application.status === 'approved' 
                  ? 'bg-green-300 text-green-800 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </button>
            <button
              onClick={() => handleStatusChange(application._id, 'rejected')}
              disabled={application.status === 'rejected'}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-md ${
                application.status === 'rejected' 
                  ? 'bg-red-300 text-red-800 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        )}
      </div>
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
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{application.applicant.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(application.applicant.skills) ? application.applicant.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                )) : (
                  <span className="text-gray-500 text-sm">No skills listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Cover Letter</h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{application.applicant.coverLetter || 'No cover letter provided'}</p>
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
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            
            {/* Always visible Accept/Reject buttons */}
            <div className="w-full pt-2">
              {application.status === 'pending' ? (
                <>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Action Required</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        handleStatusChange(application._id, 'approved');
                        onClose();
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium shadow-md"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Accept Application
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(application._id, 'rejected');
                        onClose();
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium shadow-md"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Reject Application
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(application._id, 'approved')}
                    disabled={application.status === 'approved'}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors font-medium shadow-md ${
                      application.status === 'approved' 
                        ? 'bg-green-300 text-green-800 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Accept Application
                  </button>
                  <button
                    onClick={() => handleStatusChange(application._id, 'rejected')}
                    disabled={application.status === 'rejected'}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors font-medium shadow-md ${
                      application.status === 'rejected' 
                        ? 'bg-red-300 text-red-800 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Applications</h2>
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
        {loading ? (
          <div className="text-center py-12">
            <div className="loading-spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : filteredAndSortedApplications.length === 0 ? (
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

export default AllApplicationsReview;