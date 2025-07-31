import { default as axios } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getSavedCandidates = async (token) => {
  const response = await axios.get(`${API_URL}/users/saved-candidates`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const saveCandidate = async (candidateId, token) => {
  const response = await axios.post(`${API_URL}/users/save-candidate/${candidateId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const removeSavedCandidate = async (candidateId, token) => {
  const response = await axios.delete(`${API_URL}/users/save-candidate/${candidateId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateCandidateStatus = async (candidateId, status, token) => {
  const response = await axios.put(`${API_URL}/users/update-candidate-status/${candidateId}`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateCandidateNotes = async (candidateId, notes, token) => {
  const response = await axios.put(`${API_URL}/users/update-candidate-notes/${candidateId}`, { notes }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getSavedCandidates,
  saveCandidate,
  removeSavedCandidate,
  updateCandidateStatus,
  updateCandidateNotes
};
