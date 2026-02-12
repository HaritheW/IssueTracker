import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { loginUser } from '../redux/authSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) navigate('/issues')
  }, [user, navigate])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required.'
    if (!password) errors.password = 'Password is required.'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h2 className="auth-tagline">Track issues. Ship faster.</h2>
            <p className="auth-subline">
              Sign in to manage your issues and keep your team aligned.
            </p>
          </div>
        </div>
        <div className="auth-form-wrapper">
          <div className="auth-card">
            <div className="auth-card-inner">
              <h1 className="auth-heading">Welcome back</h1>
              <p className="auth-description">Enter your credentials to sign in.</p>
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="auth-form">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  error={formErrors.email}
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  error={formErrors.password}
                />
                <Button
                  label={loading ? 'Signing in...' : 'Sign in'}
                  type="submit"
                  disabled={loading}
                />
              </form>
              <p className="auth-footer">
                Don’t have an account?{' '}
                <Link to="/register" className="auth-link">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
