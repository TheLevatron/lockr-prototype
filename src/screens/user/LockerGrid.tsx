import { useState } from 'react'
import { mockLockersByBank } from '../../state/mock'
import { ReservationDrawer } from './ReservationDrawer'

export function LockerGrid({ bankId, onClose }: { bankId: string, onClose: () => void }) {
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null)
  const lockers = mockLockersByBank(bankId)

  const statusClass = (s: string) => ({
    available: 'bg-green-100 hover:bg-green-200 text-success',
    reserved: 'bg-yellow-100 text-warning',
    occupied: 'bg-red-100 text-danger',
    unavailable: 'bg-gray-100 text-gray-500',
  }[s])

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center p-6" role="dialog" aria-modal>
      <div className="card w-full max-w-xl">
        <div className="p-5 flex items-center justify-between border-b">
          <div className="font-medium">Locker Set: {bankId.toUpperCase()}</div>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="p-6 grid grid-cols-3 gap-4">
          {lockers.map(l => (
            <button
              key={l.id}
              className={`rounded-lg p-4 text-sm font-medium border ${statusClass(l.status)} ${l.status === 'available' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              disabled={l.status !== 'available'}
              onClick={() => setSelectedLocker(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="p-5 border-t flex items-center gap-3 text-xs">
          <span className="badge badge-success">Available</span>
          <span className="badge badge-warning">Reserved</span>
          <span className="badge badge-danger">Occupied</span>
          <span className="badge badge-muted">Unavailable</span>
        </div>
      </div>

      {selectedLocker && (
        <ReservationDrawer lockerId={selectedLocker} onClose={() => setSelectedLocker(null)} />
      )}
    </div>
  )
}