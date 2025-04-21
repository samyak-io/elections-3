import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Candidate {
  _id: string;
  name: string;
  cohortType: string;
  electionType: string;
}

export interface VoteCount {
  candidateName: string;
  count: number;
  electionType: string;
}

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  getVotingStatus: () => api.get('/api/users/voting-status')
};

export const candidateAPI = {
  getAll: () => api.get<Candidate[]>('/api/candidates'),
  getByElectionType: (type: string) => api.get<Candidate[]>(`/api/candidates/${type}`),
  create: (data: Omit<Candidate, '_id'>) => api.post('/api/candidates', data)
};

export const voteAPI = {
  submit: (candidateId: string, electionType: string) => 
    api.post('/api/votes', { candidateId, electionType }),
  getCounts: () => api.get<VoteCount[]>('/api/votes/counts')
};

export const adminAPI = {
  getCandidatesWithVotes: () => api.get('/api/admin/candidates'),
  getStatistics: () => api.get('/api/admin/statistics')
};

export default api; 