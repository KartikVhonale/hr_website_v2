import axios from 'axios';

const API_URL = 'http://localhost:3000/api/jobs';

const getAllJobs = (params) => {
    return axios.get(API_URL, { params });
};

const getJobById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export {
    getAllJobs,
    getJobById,
};
