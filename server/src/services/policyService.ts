import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../data/store';
import { Policy } from '../types';

export function getAllPolicies(): Policy[] {
  return Array.from(dataStore.policies.values());
}

export function getActivePolicies(): Policy[] {
  return Array.from(dataStore.policies.values()).filter((p) => p.isActive);
}

export function getPolicyById(id: string): Policy | null {
  return dataStore.policies.get(id) || null;
}

export function createPolicy(data: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>): Policy {
  const newPolicy: Policy = {
    id: uuidv4(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dataStore.policies.set(newPolicy.id, newPolicy);
  return newPolicy;
}

export function updatePolicy(
  id: string,
  updates: Partial<Omit<Policy, 'id' | 'createdAt'>>
): Policy | null {
  const policy = dataStore.policies.get(id);
  if (!policy) return null;

  const updatedPolicy: Policy = {
    ...policy,
    ...updates,
    updatedAt: new Date(),
  };

  dataStore.policies.set(id, updatedPolicy);
  return updatedPolicy;
}

export function deletePolicy(id: string): boolean {
  return dataStore.policies.delete(id);
}
