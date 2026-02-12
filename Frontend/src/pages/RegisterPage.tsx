import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { registerUser } from '../redux/authSlice'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useAppSelector((state) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) navigate('/issues')
  }, [user, navigate])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Name is required.'
    if (!email.trim()) errors.email = 'Email is required.'
    if (email && !emailRegex.test(email)) errors.email = 'Invalid email format.'
    if (!password) errors.password = 'Password is required.'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    dispatch(registerUser({ name, email, password }))
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
            <h2 className="auth-tagline">Get started in seconds</h2>
            <p className="auth-subline">
              Create an account and start tracking issues with your team.
            </p>
          </div>
        </div>
        <div className="auth-form-wrapper">
          <div className="auth-card">
            <div className="auth-card-inner">
              <h1 className="auth-heading">Create account</h1>
              <p className="auth-description">
                Enter your details to get started.
              </p>
              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="auth-form">
                <InputField
                  label="Full name"
                  name="name"
                  value={name}
                  onChange={setName}
                  placeholder="Jane Doe"
                  error={formErrors.name}
                />
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
                  label={loading ? 'Creating account...' : 'Create account'}
                  type="submit"
                  disabled={loading}
                />
              </form>
              <p className="auth-footer">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
