import { Outlet } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'

export function UserApp() {
  return (
    <AppShell
      nav=[
        { label: 'Dashboard', to: '/app' },
        { label: 'Floor Plan', to: '/app' },
        { label: 'My Reservations', to: '/app?tab=reservations' },
      ]
    >
      <Outlet />
    </AppShell>
  )
}