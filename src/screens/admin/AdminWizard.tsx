export function AdminWizard() {
  const steps = ['Academic Year', 'Terms', 'Pricing', 'Policies']
  return (
    <div className="max-w-3xl space-y-5">
      <div className="card p-8">
        <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
        <p className="text-gray-600">Academic break has ended. Let’s set up the new academic year.</p>
        <div className="mt-5 grid gap-4">
          <label className="text-sm">Academic Year</label>
          <input className="input" placeholder="2025–2026" />
          <div className="flex justify-end">
            <button className="btn btn-primary">Next</button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-center">
        {steps.map((_, i) => <span key={i} className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-gray-300'}`} />)}
      </div>
    </div>
  )
}