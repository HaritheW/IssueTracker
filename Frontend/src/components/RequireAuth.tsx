import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type RequireAuthProps = {
  children: React.ReactElement
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const token = useAuthStore((state) => state.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}
