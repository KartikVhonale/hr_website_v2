import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/jobseeker`;

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found');
    }
    return token;
};

const getJobseekerProfile = () => {
    return axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateJobseekerProfile = async (profileData) => {
    try {
        console.log('API URL:', API_URL);
        console.log('Auth Token:', getAuthToken() ? 'Present' : 'Missing');
        console.log('Profile Data being sent:', profileData);

        const response = await axios.put(`${API_URL}/profile`, profileData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        console.log('API Response:', response);
        return response;
    } catch (error) {
        console.error('API Error:', error);
        console.error('API Error Response:', error.response);
        throw error;
    }
};

const getSavedJobs = () => {
    return axios.get(`${API_URL}/saved-jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const saveJob = (jobId) => {
    return axios.post(`${API_URL}/saved-jobs/${jobId}`, null, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const unsaveJob = (jobId) => {
    return axios.delete(`${API_URL}/saved-jobs/${jobId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getAppliedJobs = () => {
    return axios.get(`${API_URL}/applied-jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateApplicationStatus = (applicationId, status) => {
    return axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/applications/${applicationId}`, { status }, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const uploadResume = async (file) => {
    try {
        console.log('Uploading resume file:', file.name);

        const formData = new FormData();
        formData.append('resume', file);

        const response = await axios.post(`${API_URL}/upload-resume`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        console.log('Resume upload response:', response);
        return response;
    } catch (error) {
        console.error('Resume upload error:', error);
        console.error('Resume upload error response:', error.response);
        throw error;
    }
};

const deleteResume = async () => {
    try {
        console.log('Deleting resume');

        const response = await axios.delete(`${API_URL}/resume`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        console.log('Resume delete response:', response);
        return response;
    } catch (error) {
        console.error('Resume delete error:', error);
        console.error('Resume delete error response:', error.response);
        throw error;
    }
};

export {
    getJobseekerProfile,
    updateJobseekerProfile,
    getSavedJobs,
    saveJob,
    unsaveJob,
    getAppliedJobs,
    updateApplicationStatus,
    uploadResume,
    deleteResume,
};
