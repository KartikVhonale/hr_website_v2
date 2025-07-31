import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getAllJobs = () => {
    return axios.get(`${API_URL}/jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getJobById = (id) => {
    return axios.get(`${API_URL}/jobs/${id}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateJob = (id, jobData) => {
    return axios.put(`${API_URL}/jobs/${id}`, jobData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const createJob = (jobData) => {
    return axios.post(`${API_URL}/jobs`, jobData, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const deleteJob = (id) => {
    return axios.delete(`${API_URL}/jobs/${id}`, {
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
