import { createBrowserRouter } from 'react-router-dom'
import { Splash } from './screens/Splash'
import { Login } from './screens/Login'
import { UserApp } from './screens/user/UserApp'
import { FloorPlan } from './screens/user/FloorPlan'
import { Verified } from './screens/user/Verified'
import { ReservationFlow } from './screens/user/ReservationFlow'
import { AdminApp } from './screens/admin/AdminApp'
import { AdminWizard } from './screens/admin/AdminWizard'
import { AdminMain } from './screens/admin/AdminMain'
import { AdminFloor } from './screens/admin/AdminFloor'

export const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/login', element: <Login /> },
  {
    path: '/app',
    element: <UserApp />,
    children: [
      { index: true, element: <FloorPlan /> },
      { path: 'reserve', element: <ReservationFlow /> },
      { path: 'verified', element: <Verified /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminApp />,
    children: [
      { index: true, element: <AdminMain /> },
      { path: 'wizard', element: <AdminWizard /> },
      { path: 'floor', element: <AdminFloor /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })
