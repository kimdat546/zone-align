import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
export const useApiClient = () => {
  const { getToken } = useAuth();

  // Configure axios interceptor to add auth token
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

// API Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  timezone: string;
  workHours: {
    start: string;
    end: string;
    days: number[];
  };
  maxEarlyMeetings: number;
  maxLateMeetings: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: User;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  slug: string;
  timezone: string;
  inviteCode: string;
  ownerId: string;
  owner: User;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  timezone?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  timezone?: string;
}

export interface UpdateProfileData {
  name?: string;
  timezone?: string;
  workHours?: {
    start: string;
    end: string;
    days: number[];
  };
  maxEarlyMeetings?: number;
  maxLateMeetings?: number;
}

// API Functions
export const authApi = {
  getProfile: (): Promise<User> => api.get('/auth/me').then(res => res.data),
  updateProfile: (data: UpdateProfileData): Promise<User> => 
    api.put('/auth/profile', data).then(res => res.data),
};

export const teamsApi = {
  getTeams: (): Promise<Team[]> => api.get('/teams').then(res => res.data),
  getTeam: (teamId: string): Promise<Team> => 
    api.get(`/teams/${teamId}`).then(res => res.data),
  createTeam: (data: CreateTeamData): Promise<Team> => 
    api.post('/teams', data).then(res => res.data),
  updateTeam: (teamId: string, data: UpdateTeamData): Promise<Team> => 
    api.put(`/teams/${teamId}`, data).then(res => res.data),
  deleteTeam: (teamId: string): Promise<void> => 
    api.delete(`/teams/${teamId}`),
  joinTeam: (inviteCode: string): Promise<Team> => 
    api.post('/teams/join', { inviteCode }).then(res => res.data),
  removeMember: (teamId: string, userId: string): Promise<void> => 
    api.delete(`/teams/${teamId}/members/${userId}`),
  updateMemberRole: (teamId: string, userId: string, role: string): Promise<TeamMember> => 
    api.put(`/teams/${teamId}/members/${userId}/role`, { role }).then(res => res.data),
  regenerateInviteCode: (teamId: string): Promise<{ inviteCode: string }> => 
    api.post(`/teams/${teamId}/invite-code/regenerate`).then(res => res.data),
};