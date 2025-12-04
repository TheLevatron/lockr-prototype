import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Reservation, CreateReservationRequest } from '../types';

interface ReservationsResponse {
  reservations: Reservation[];
}

interface ReservationResponse {
  reservation: Reservation;
}

export function useReservations(status?: string) {
  return useQuery<Reservation[]>({
    queryKey: ['reservations', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const response = await api.get<ReservationsResponse>(`/reservations${params}`);
      return response.data.reservations;
    },
  });
}

export function useReservation(id: string) {
  return useQuery<Reservation>({
    queryKey: ['reservations', id],
    queryFn: async () => {
      const response = await api.get<ReservationResponse>(`/reservations/${id}`);
      return response.data.reservation;
    },
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationRequest) => {
      const response = await api.post<ReservationResponse>('/reservations', data);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['lockers'] });
    },
  });
}

export function useAcceptAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ReservationResponse>(`/reservations/${id}/agreement`);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useSubmitForEndorsement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, receiptUrl }: { id: string; receiptUrl?: string }) => {
      const response = await api.put<ReservationResponse>(`/reservations/${id}/submit`, { receiptUrl });
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useEndorseReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ReservationResponse>(`/reservations/${id}/endorse`);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useApproveReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ReservationResponse>(`/reservations/${id}/approve`);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['lockers'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ReservationResponse>(`/reservations/${id}/cancel`);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['lockers'] });
    },
  });
}

export function useExtendReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newEndDate }: { id: string; newEndDate: string }) => {
      const response = await api.put<ReservationResponse>(`/reservations/${id}/extend`, { newEndDate });
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
