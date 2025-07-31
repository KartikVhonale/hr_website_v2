import httpClient from '../utils/httpClient.js';

const API_URL = '/api/jobs';

const getAllJobs = (params) => {
    return httpClient.get(API_URL, { params });
};

const getJobById = (id) => {
    return httpClient.get(`${API_URL}/${id}`);
};

export {
    getAllJobs,
    getJobById,
};
