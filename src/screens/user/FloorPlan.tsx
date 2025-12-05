import { useState } from 'react'
import { LockerGrid } from './LockerGrid'
import { mockBanks } from '../../state/mock'

export function FloorPlan() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-3">Floor Plan</h2>
        <p className="text-sm text-gray-600">Tap a bank to view lockers</p>
      </div>

      <div className="card">
        <div className="relative aspect-[16/9] bg-[url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-white/70" />
          <div className="absolute inset-6 grid grid-cols-6 grid-rows-4 gap-4">
            {mockBanks.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBank(b.id)}
                className="rounded-lg bg-white/80 hover:bg-white shadow-sm border border-gray-200 text-sm font-medium px-3 py-2"
                title={`Set ${b.set}`}
              >
                Set {b.set}
              </button>
            ))}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="badge badge-muted">Elevator</span>
            <span className="badge badge-muted">Stairs</span>
            <span className="badge badge-muted">Restroom</span>
          </div>
        </div>
      </div>

      {selectedBank && <LockerGrid bankId={selectedBank} onClose={() => setSelectedBank(null)} />}
    </div>
  )
}