import api from '../../api/axios'
import type { User } from '../../utils/types'

const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

export type AuthSlice = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  logout: () => void
  registerUser: (payload: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  loginUser: (payload: { email: string; password: string }) => Promise<void>
}

export const createAuthSlice = (
  set: (partial: Partial<AuthSlice> | ((s: AuthSlice) => Partial<AuthSlice>)) => void,
  get: () => AuthSlice
): AuthSlice => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,

  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  registerUser: async (payload) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/api/auth/register', payload)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || 'Registration failed.',
      })
      throw error
    }
  },

  loginUser: async (payload) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/api/auth/login', payload)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error?.response?.data?.message || 'Login failed.',
      })
      throw error
    }
  },
})
