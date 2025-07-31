import httpClient from '../utils/httpClient.js';

const API_URL = '/api';

const getSavedCandidates = async (token) => {
  const response = await httpClient.get(`${API_URL}/users/saved-candidates`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const saveCandidate = async (candidateId, token) => {
  const response = await httpClient.post(`${API_URL}/users/save-candidate/${candidateId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const removeSavedCandidate = async (candidateId, token) => {
  const response = await httpClient.delete(`${API_URL}/users/save-candidate/${candidateId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateCandidateStatus = async (candidateId, status, token) => {
  const response = await httpClient.put(`${API_URL}/users/update-candidate-status/${candidateId}`, { status }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateCandidateNotes = async (candidateId, notes, token) => {
  const response = await httpClient.put(`${API_URL}/users/update-candidate-notes/${candidateId}`, { notes }, {
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
