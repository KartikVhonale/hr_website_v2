import { default as axios } from 'axios';

const API_URL = 'http://localhost:3000/api/employer';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getEmployerProfile = () => {
    return axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateEmployerProfile = (profileData) => {
    return axios.put(`${API_URL}/profile`, profileData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getPostedJobs = () => {
    return axios.get(`${API_URL}/jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getApplicationsForJob = (jobId) => {
    return axios.get(`${API_URL}/jobs/${jobId}/applications`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateApplicationStatus = (applicationId, status) => {
    return axios.put(`${API_URL}/applications/${applicationId}`, { status }, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getSavedCandidates = () => {
    return axios.get(`${API_URL}/saved-candidates`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const saveCandidate = (candidateId) => {
    return axios.post(`${API_URL}/saved-candidates/${candidateId}`, null, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const unsaveCandidate = (candidateId) => {
    return axios.delete(`${API_URL}/saved-candidates/${candidateId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const deleteJob = (jobId) => {
    return axios.delete(`http://localhost:3000/api/jobs/${jobId}`, {
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
