import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Location, FloorPlan } from '../types';

interface LocationsResponse {
  locations: Location[];
}

interface LocationResponse {
  location: Location;
}

interface FloorsResponse {
  floors: FloorPlan[];
}

interface FloorResponse {
  floorPlan: FloorPlan;
}

export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get<LocationsResponse>('/locations');
      return response.data.locations;
    },
  });
}

export function useLocation(id: string) {
  return useQuery<Location>({
    queryKey: ['locations', id],
    queryFn: async () => {
      const response = await api.get<LocationResponse>(`/locations/${id}`);
      return response.data.location;
    },
    enabled: !!id,
  });
}

export function useFloors(locationId: string) {
  return useQuery<FloorPlan[]>({
    queryKey: ['locations', locationId, 'floors'],
    queryFn: async () => {
      const response = await api.get<FloorsResponse>(`/locations/${locationId}/floors`);
      return response.data.floors;
    },
    enabled: !!locationId,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<LocationResponse>('/locations', data);
      return response.data.location;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Location> & { id: string }) => {
      const response = await api.put<LocationResponse>(`/locations/${id}`, data);
      return response.data.location;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

export function useCreateFloor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ locationId, ...data }: { locationId: string; floorNumber: number; floorName: string }) => {
      const response = await api.post<FloorResponse>(`/locations/${locationId}/floors`, data);
      return response.data.floorPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}
