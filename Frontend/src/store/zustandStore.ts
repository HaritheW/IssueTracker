import { create } from 'zustand'
import api from '../api/axios'
import type { User, Issue, IssueFilters, Pagination } from '../utils/types'

//Auth slice
type AuthState = {
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

const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

const authInitial: Omit<AuthState, 'logout' | 'registerUser' | 'loginUser'> = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
}

//Issue slice
type IssueState = {
  items: Issue[]
  selected: Issue | null
  filters: IssueFilters
  pagination: Pagination
  stats: Record<string, number>
  loading: boolean
  error: string | null
  setFilters: (payload: Partial<IssueFilters>) => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  clearSelectedIssue: () => void
  fetchIssues: (payload?: {
    page?: number
    limit?: number
    q?: string
  }) => Promise<void>
  fetchIssueById: (id: string) => Promise<void>
  createIssue: (payload: Partial<Issue>) => Promise<Issue>
  updateIssue: (payload: { id: string; data: Partial<Issue> }) => Promise<Issue>
  deleteIssue: (id: string) => Promise<void>
  fetchStats: () => Promise<void>
}

const issueInitial = {
  items: [] as Issue[],
  selected: null as Issue | null,
  filters: {
    q: '',
    status: '',
    priority: '',
    severity: '',
  } as IssueFilters,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  } as Pagination,
  stats: {} as Record<string, number>,
  loading: false,
  error: null as string | null,
}

// --- Combined store type ---
type Store = {
  auth: AuthState
  issues: IssueState
}

export const useStore = create<Store>((set, get) => ({
  auth: {
    ...authInitial,

    logout: () => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      set((state) => ({
        auth: { ...state.auth, user: null, token: null },
      }))
    },

    registerUser: async (payload) => {
      set((state) => ({
        auth: { ...state.auth, loading: true, error: null },
      }))
      try {
        const { data } = await api.post('/api/auth/register', payload)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        set((state) => ({
          auth: {
            ...state.auth,
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          },
        }))
      } catch (error: any) {
        set((state) => ({
          auth: {
            ...state.auth,
            loading: false,
            error:
              error?.response?.data?.message || 'Registration failed.',
          },
        }))
        throw error
      }
    },

    loginUser: async (payload) => {
      set((state) => ({
        auth: { ...state.auth, loading: true, error: null },
      }))
      try {
        const { data } = await api.post('/api/auth/login', payload)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        set((state) => ({
          auth: {
            ...state.auth,
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          },
        }))
      } catch (error: any) {
        set((state) => ({
          auth: {
            ...state.auth,
            loading: false,
            error: error?.response?.data?.message || 'Login failed.',
          },
        }))
        throw error
      }
    },
  },

  issues: {
    ...issueInitial,

    setFilters: (payload) =>
      set((state) => ({
        issues: {
          ...state.issues,
          filters: { ...state.issues.filters, ...payload },
          pagination: { ...state.issues.pagination, page: 1 },
        },
      })),

    setPage: (page) =>
      set((state) => ({
        issues: {
          ...state.issues,
          pagination: { ...state.issues.pagination, page },
        },
      })),

    setLimit: (limit) =>
      set((state) => ({
        issues: {
          ...state.issues,
          pagination: {
            ...state.issues.pagination,
            limit,
            page: 1,
          },
        },
      })),

    clearSelectedIssue: () =>
      set((state) => ({
        issues: { ...state.issues, selected: null },
      })),

    fetchIssues: async (payload) => {
      set((state) => ({
        issues: { ...state.issues, loading: true, error: null },
      }))
      try {
        const { issues } = get()
        const params = {
          page: payload?.page ?? issues.pagination.page,
          limit: payload?.limit ?? issues.pagination.limit,
          q: payload?.q ?? issues.filters.q,
          status: issues.filters.status || undefined,
          priority: issues.filters.priority || undefined,
          severity: issues.filters.severity || undefined,
        }
        const { data } = await api.get('/api/issues', { params })
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            items: data.data,
            pagination: {
              page: data.page,
              limit: data.limit,
              total: data.total,
              totalPages: data.totalPages,
            },
          },
        }))
      } catch (error: any) {
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            error:
              error?.response?.data?.message || 'Failed to load issues.',
          },
        }))
        throw error
      }
    },

    fetchIssueById: async (id) => {
      set((state) => ({
        issues: { ...state.issues, loading: true, error: null },
      }))
      try {
        const { data } = await api.get(`/api/issues/${id}`)
        set((state) => ({
          issues: { ...state.issues, loading: false, selected: data.issue },
        }))
      } catch (error: any) {
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            error:
              error?.response?.data?.message || 'Failed to load issue.',
          },
        }))
        throw error
      }
    },

    createIssue: async (payload) => {
      set((state) => ({
        issues: { ...state.issues, loading: true, error: null },
      }))
      try {
        const { data } = await api.post('/api/issues', payload)
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            items: [data.issue, ...state.issues.items],
          },
        }))
        return data.issue
      } catch (error: any) {
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            error:
              error?.response?.data?.message || 'Failed to create issue.',
          },
        }))
        throw error
      }
    },

    updateIssue: async ({ id, data: updateData }) => {
      set((state) => ({
        issues: { ...state.issues, loading: true, error: null },
      }))
      try {
        const { data } = await api.put(`/api/issues/${id}`, updateData)
        const issue = data.issue as Issue
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            items: state.issues.items.map((i) =>
              i._id === issue._id ? issue : i
            ),
            selected:
              state.issues.selected?._id === issue._id
                ? issue
                : state.issues.selected,
          },
        }))
        return issue
      } catch (error: any) {
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            error:
              error?.response?.data?.message || 'Failed to update issue.',
          },
        }))
        throw error
      }
    },

    deleteIssue: async (id) => {
      set((state) => ({
        issues: { ...state.issues, loading: true, error: null },
      }))
      try {
        await api.delete(`/api/issues/${id}`)
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            items: state.issues.items.filter((i) => i._id !== id),
            selected:
              state.issues.selected?._id === id ? null : state.issues.selected,
          },
        }))
      } catch (error: any) {
        set((state) => ({
          issues: {
            ...state.issues,
            loading: false,
            error:
              error?.response?.data?.message || 'Failed to delete issue.',
          },
        }))
        throw error
      }
    },

    fetchStats: async () => {
      try {
        const { data } = await api.get('/api/issues/stats')
        set((state) => ({
          issues: { ...state.issues, stats: data.counts },
        }))
      } catch {
        // optional: set error on issues slice
      }
    },
  },
}))

// Selector hooks: support both useAuthStore() and useAuthStore(selector)
export function useAuthStore(): AuthState
export function useAuthStore<T>(selector: (state: AuthState) => T): T
export function useAuthStore<T>(selector?: (state: AuthState) => T) {
  if (selector) return useStore((state) => selector(state.auth))
  return useStore((state) => state.auth)
}

export function useIssueStore(): IssueState
export function useIssueStore<T>(selector: (state: IssueState) => T): T
export function useIssueStore<T>(selector?: (state: IssueState) => T) {
  if (selector) return useStore((state) => selector(state.issues))
  return useStore((state) => state.issues)
}
