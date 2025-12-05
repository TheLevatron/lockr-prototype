import { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'

export function AppShell(props: PropsWithChildren<{ nav: { label: string, to: string, icon?: JSX.Element }[], right?: JSX.Element }>) {
  const { nav, right, children } = props
  return (
    <div className="h-screen grid grid-rows-[64px_1fr]">
      <header className="topbar">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-bold">R</div>
          <div className="font-semibold">LockR Reservation</div>
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </header>
      <div className="grid grid-cols-[256px_1fr]">
        <aside className="sidebar">
          <div className="p-3">
            <input placeholder="Search" className="input" />
          </div>
          <nav className="mt-2 space-y-1">
            {nav.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx('flex items-center gap-3 px-4 py-3 text-sm', isActive ? 'text-primary font-medium bg-blue-50' : 'text-gray-700 hover:bg-gray-50')}>  
                {item.icon} <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto p-3">
            <Link to="/login" className="btn btn-danger w-full">Sign Out</Link>
          </div>
        </aside>
        <main className="p-6 overflow-auto section">
          {children}
        </main>
      </div>
    </div>
  )
}