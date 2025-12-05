import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function ReservationDrawer({ lockerId, onClose }: { lockerId: string, onClose: () => void }) {
  const [ack, setAck] = useState(false)
  const nav = useNavigate()
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl border-l border-gray-200">
      <div className="p-5 border-b flex items-center justify-between">
        <div className="font-semibold">Reserve Locker {lockerId}</div>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
      <div className="p-6 space-y-5">
        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Reservation Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 space-y-1">
              <div className="text-xs text-gray-500">Term</div>
              <div className="font-medium">1 Semester</div>
            </div>
            <div className="card p-4 space-y-1">
              <div className="text-xs text-gray-500">Valid Until</div>
              <div className="font-medium">08-10-2026</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rules & Regulations</h3>
          <div className="card p-4 max-h-48 overflow-auto text-sm leading-7">
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Keep your combination confidential.</li>
              <li>No prohibited items inside lockers.</li>
              <li>Locker must be cleared at end of term.</li>
            </ol>
          </div>
          <label className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" checked={ack} onChange={e => setAck(e.target.checked)} />
            I have read and agree to the rules and regulations.
          </label>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Receipt</h3>
          <div className="card p-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-sm text-gray-600">
              Drag & drop receipt here or click to upload
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!ack} onClick={() => nav('/app/verified')}>Reserve</button>
        </div>
      </div>
    </div>
  )
}