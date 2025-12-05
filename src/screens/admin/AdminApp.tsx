import { Outlet } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'

export function AdminApp() {
  return (
    <AppShell
      nav={[
        { label: 'For Endorsement', to: '/admin' },
        { label: 'For Approval', to: '/admin?tab=approval' },
        { label: 'Occupied', to: '/admin?tab=occupied' },
        { label: 'History', to: '/admin?tab=history' },
        { label: 'Floor Plan', to: '/admin/floor' },
        { label: 'Wizard', to: '/admin/wizard' },
      ]}
    >
      <Outlet />
    </AppShell>
  )
}