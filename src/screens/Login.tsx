import { useNavigate } from 'react-router-dom'

export function Login() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:grid place-items-center bg-primary text-white">
        <div className="text-8xl font-bold">R</div>
        <div className="absolute bottom-8 opacity-80">iACADEMY</div>
      </div>
      <div className="grid place-items-center p-6">
        <div className="card w-full max-w-sm">
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Welcome to LockR</h1>
            <button className="btn btn-ghost w-full border border-gray-300" onClick={() => nav('/app')}>  
              <img alt="" src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-4 w-4" />
              Continue with Google
            </button>
            <div className="grid gap-3">
              <input className="input" placeholder="Username" />
              <input className="input" placeholder="Password" type="password" />
            </div>
            <button className="btn btn-primary w-full" onClick={() => nav('/app')}>Log In</button>
            <div className="text-xs text-gray-500 text-center">
              By logging in you agree to the school’s locker policies.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}