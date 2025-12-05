import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Splash() {
  const nav = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => nav('/login'), 1200)
    return () => clearTimeout(t)
  }, [nav])
  return (
    <div className="h-screen grid place-items-center bg-primary">
      <div className="text-white text-7xl font-bold tracking-tight">R</div>
      <div className="absolute bottom-6 text-white/70 text-sm">iACADEMY</div>
    </div>
  )
}