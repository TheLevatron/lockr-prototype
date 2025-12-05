import { useState } from 'react'

export function AdminFloor() {
  const [editing, setEditing] = useState(false)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Floor Plan (Admin)</h2>
        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={() => setEditing(v => !v)}>{editing ? 'Done' : 'Edit layout'}</button>
          <button className="btn btn-primary">Add Locker</button>
          <button className="btn btn-danger">Delete Locker</button>
        </div>
      </div>
      <div className="card p-4">
        <div className="relative aspect-[16/9] bg-white rounded-xl border border-dashed grid place-items-center text-gray-500">
          Drag to arrange banks and lockers (placeholder)
        </div>
      </div>

      <div className="card p-4 max-w-lg">
        <h3 className="font-medium mb-3">Update Locker</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Locker ID</label>
            <input className="input" placeholder="K-10" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Status</label>
            <select className="input">
              <option>Available</option>
              <option>Reserved</option>
              <option>Occupied</option>
              <option>Unavailable</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">User (Student ID)</label>
            <input className="input" placeholder="202101044" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Agreement Date</label>
            <input className="input" type="date" />
          </div>
          <div>
            <label className="text-xs text-gray-500">End of Agreement</label>
            <input className="input" type="date" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Duplicate Key</label>
            <select className="input"><option>No</option><option>Yes</option></select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  )
}