import httpClient from '../utils/httpClient.js';

const API_URL = `/api/jobseeker`;

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found');
    }
    return token;
};

const getJobseekerProfile = () => {
    return httpClient.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateJobseekerProfile = async (profileData) => {
    try {
        const response = await httpClient.put(`${API_URL}/profile`, profileData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        return response;
    } catch (error) {
        console.error('API Error:', error);
        console.error('API Error Response:', error.response);
        throw error;
    }
};

const getSavedJobs = () => {
    return httpClient.get(`${API_URL}/saved-jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const saveJob = (jobId) => {
    return httpClient.post(`${API_URL}/saved-jobs/${jobId}`, null, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const unsaveJob = (jobId) => {
    return httpClient.delete(`${API_URL}/saved-jobs/${jobId}`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const getAppliedJobs = () => {
    return httpClient.get(`${API_URL}/applied-jobs`, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const updateApplicationStatus = (applicationId, status) => {
    return httpClient.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/applications/${applicationId}`, { status }, {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
        },
    });
};

const uploadResume = async (file) => {
    try {
        const formData = new FormData();
        formData.append('resume', file);

        const response = await httpClient.post(`${API_URL}/upload-resume`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        return response;
    } catch (error) {
        console.error('Resume upload error:', error);
        console.error('Resume upload error response:', error.response);
        throw error;
    }
};

const deleteResume = async () => {
    try {
        const response = await httpClient.delete(`${API_URL}/resume`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

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
