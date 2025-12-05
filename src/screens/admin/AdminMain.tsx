const cols = ['Locker ID','Referral No.','Student ID','Agreement','Duration','Status','Approved?']
export function AdminMain() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="card p-2 flex items-center gap-2">
          <button className="btn btn-ghost">For Endorsement</button>
          <button className="btn btn-ghost">For Approval</button>
          <button className="btn btn-ghost">Occupied</button>
          <button className="btn btn-ghost">History</button>
          <button className="btn btn-primary">Floor Plan</button>
        </div>
        <input className="input max-w-xs" placeholder="Search..." />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[800px] w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {cols.map(c => <th key={c} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, r) => (
                <tr key={r} className="border-t">
                  {cols.map(c => <td key={c} className="px-4 py-3 text-sm text-gray-700">—</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}