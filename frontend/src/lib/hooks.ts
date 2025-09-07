"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient, authApi, teamsApi, User, Team, CreateTeamData, UpdateTeamData, UpdateProfileData } from './api';
import { useAuth } from '@clerk/nextjs';

// Auth hooks
export const useProfile = () => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: !!getToken,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(['profile'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Team hooks
export const useTeams = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
    enabled: !!getToken,
  });
};

export const useTeam = (teamId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsApi.getTeam(teamId),
    enabled: !!getToken && !!teamId,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamData) => teamsApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: UpdateTeamData }) => 
      teamsApi.updateTeam(teamId, data),
    onSuccess: (updatedTeam: Team) => {
      queryClient.setQueryData(['team', updatedTeam.id], updatedTeam);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', updatedTeam.id] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => teamsApi.deleteTeam(teamId),
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.removeQueries({ queryKey: ['team', teamId] });
    },
  });
};

export const useJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteCode: string) => teamsApi.joinTeam(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) => 
      teamsApi.removeMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId, role }: { teamId: string; userId: string; role: string }) => 
      teamsApi.updateMemberRole(teamId, userId, role),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
    },
  });
};

export const useRegenerateInviteCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => teamsApi.regenerateInviteCode(teamId),
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
    },
  });
};