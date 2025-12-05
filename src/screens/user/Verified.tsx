export function Verified() {
  return (
    <div className="grid place-items-center">
      <div className="card p-6 w-full max-w-md text-center space-y-3">
        <div className="grid place-items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 grid place-items-center text-2xl">✓</div>
        </div>
        <h2 className="text-lg font-semibold">Your locker has been verified!</h2>
        <div className="text-sm text-gray-600">
          Locker: B-05 • Floor: 8F • Valid until: 08-10-2026
        </div>
      </div>
    </div>
  )
}