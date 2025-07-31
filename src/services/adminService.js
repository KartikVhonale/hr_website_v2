import httpClient from '../utils/httpClient.js';

const API_URL = '/api/admin';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getAllJobs = () => {
    return httpClient.get(`${API_URL}/jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getJobById = (id) => {
    return httpClient.get(`${API_URL}/jobs/${id}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateJob = (id, jobData) => {
    return httpClient.put(`${API_URL}/jobs/${id}`, jobData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const createJob = (jobData) => {
    return httpClient.post(`${API_URL}/jobs`, jobData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const deleteJob = (id) => {
    return httpClient.delete(`${API_URL}/jobs/${id}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

export {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};
