import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'

type RequireAuthProps = {
  children: React.ReactElement
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { token } = useAppSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" replace />
  return children
}
