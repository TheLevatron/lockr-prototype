import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Policy } from '../types';

interface PoliciesResponse {
  policies: Policy[];
}

export function usePolicies() {
  return useQuery<Policy[]>({
    queryKey: ['policies'],
    queryFn: async () => {
      const response = await api.get<PoliciesResponse>('/policies');
      return response.data.policies;
    },
  });
}
