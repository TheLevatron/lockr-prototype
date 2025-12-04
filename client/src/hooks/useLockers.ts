import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Locker, CreateLockerRequest } from '../types';

interface LockersResponse {
  lockers: Locker[];
}

interface LockerResponse {
  locker: Locker;
}

export function useLockers() {
  return useQuery<Locker[]>({
    queryKey: ['lockers'],
    queryFn: async () => {
      const response = await api.get<LockersResponse>('/lockers');
      return response.data.lockers;
    },
  });
}

export function useAvailableLockers(locationId?: string, floor?: number) {
  return useQuery<Locker[]>({
    queryKey: ['lockers', 'available', locationId, floor],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (locationId) params.append('location', locationId);
      if (floor !== undefined) params.append('floor', floor.toString());
      
      const response = await api.get<LockersResponse>(`/lockers/availability?${params}`);
      return response.data.lockers;
    },
  });
}

export function useLockersByLocation(locationId: string, floor?: number) {
  return useQuery<Locker[]>({
    queryKey: ['lockers', 'location', locationId, floor],
    queryFn: async () => {
      const params = floor !== undefined ? `?floor=${floor}` : '';
      const response = await api.get<LockersResponse>(`/lockers/location/${locationId}${params}`);
      return response.data.lockers;
    },
    enabled: !!locationId,
  });
}

export function useLocker(id: string) {
  return useQuery<Locker>({
    queryKey: ['lockers', id],
    queryFn: async () => {
      const response = await api.get<LockerResponse>(`/lockers/${id}`);
      return response.data.locker;
    },
    enabled: !!id,
  });
}

export function useCreateLocker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLockerRequest) => {
      const response = await api.post<LockerResponse>('/lockers', data);
      return response.data.locker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockers'] });
    },
  });
}

export function useUpdateLocker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Locker> & { id: string }) => {
      const response = await api.put<LockerResponse>(`/lockers/${id}`, data);
      return response.data.locker;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockers'] });
    },
  });
}

export function useDeleteLocker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/lockers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lockers'] });
    },
  });
}
