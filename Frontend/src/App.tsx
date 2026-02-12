import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import RequireAuth from './components/RequireAuth'
import IssueListPage from './pages/IssueListPage'
import IssueDetailPage from './pages/IssueDetailPage'
import IssueFormPage from './pages/IssueFormPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const AUTH_PATHS = ['/', '/login', '/register']

function App() {
  const location = useLocation()
  const isAuthPage = AUTH_PATHS.includes(location.pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/issues"
          element={
            <RequireAuth>
              <IssueListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <RequireAuth>
              <IssueDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth>
              <IssueFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <RequireAuth>
              <IssueFormPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
