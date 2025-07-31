import httpClient from '../utils/httpClient.js';

const API_URL = '/api/employer';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getEmployerProfile = () => {
    return httpClient.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateEmployerProfile = (profileData) => {
    return httpClient.put(`${API_URL}/profile`, profileData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getPostedJobs = () => {
    return httpClient.get(`${API_URL}/jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getApplicationsForJob = (jobId) => {
    return httpClient.get(`${API_URL}/jobs/${jobId}/applications`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateApplicationStatus = (applicationId, status) => {
    return httpClient.put(`${API_URL}/applications/${applicationId}`, { status }, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getSavedCandidates = () => {
    return httpClient.get(`${API_URL}/saved-candidates`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const saveCandidate = (candidateId) => {
    return httpClient.post(`${API_URL}/saved-candidates/${candidateId}`, null, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const unsaveCandidate = (candidateId) => {
    return httpClient.delete(`${API_URL}/saved-candidates/${candidateId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const deleteJob = (jobId) => {
    return httpClient.delete(`http://localhost:3000/api/jobs/${jobId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

export {
    getEmployerProfile,
    updateEmployerProfile,
    getPostedJobs,
    getApplicationsForJob,
    updateApplicationStatus,
    getSavedCandidates,
    saveCandidate,
    unsaveCandidate,
    deleteJob,
};
