type Locker = { id: string, label: string, status: 'available'|'reserved'|'occupied'|'unavailable' }
type Bank = { id: string, set: string }
export const mockBanks: Bank[] = Array.from({ length: 18 }).map((_, i) => ({ id: String.fromCharCode(97 + i), set: String.fromCharCode(65 + i) }))

export function mockLockersByBank(bankId: string): Locker[] {
  return Array.from({ length: 12 }).map((_, i) => {
    const mod = i % 4
    const status = (['available','reserved','occupied','unavailable'] as const)[mod]
    return { id: `${bankId}-${i+1}`, label: `${bankId.toUpperCase()}-${i+1}`, status }
  })
}