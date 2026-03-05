import api from '../../api/axios'
import type { Issue, IssueFilters, Pagination } from '../../utils/types'

const initialFilters: IssueFilters = {
  q: '',
  status: '',
  priority: '',
  severity: '',
}

const initialPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}

export type IssueSlice = {
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

export const createIssueSlice = (
  set: (partial: Partial<IssueSlice> | ((s: IssueSlice) => Partial<IssueSlice>)) => void,
  get: () => IssueSlice
): IssueSlice => ({
  items: [],
  selected: null,
  filters: initialFilters,
  pagination: initialPagination,
  stats: {},
  loading: false,
  error: null,

  setFilters: (payload) =>
    set((state) => ({
      filters: { ...state.filters, ...payload },
      pagination: { ...state.pagination, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),

  setLimit: (limit) =>
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 },
    })),

  clearSelectedIssue: () => set({ selected: null }),

  fetchIssues: async (payload) => {
    set({ loading: true, error: null })
    try {
      const { filters, pagination } = get()
      const params = {
        page: payload?.page ?? pagination.page,
        limit: payload?.limit ?? pagination.limit,
        q: payload?.q ?? filters.q,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        severity: filters.severity || undefined,
      }
      const { data } = await api.get('/api/issues', { params })
      set({
        loading: false,
        items: data.data,
        pagination: {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        },
      })
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || 'Failed to load issues.',
      })
      throw error
    }
  },

  fetchIssueById: async (id) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get(`/api/issues/${id}`)
      set({ loading: false, selected: data.issue })
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || 'Failed to load issue.',
      })
      throw error
    }
  },

  createIssue: async (payload) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/api/issues', payload)
      set((state) => ({
        loading: false,
        items: [data.issue, ...state.items],
      }))
      return data.issue
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || 'Failed to create issue.',
      })
      throw error
    }
  },

  updateIssue: async ({ id, data: updateData }) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.put(`/api/issues/${id}`, updateData)
      const issue = data.issue as Issue
      set((state) => ({
        loading: false,
        items: state.items.map((i) => (i._id === issue._id ? issue : i)),
        selected:
          state.selected?._id === issue._id ? issue : state.selected,
      }))
      return issue
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || 'Failed to update issue.',
      })
      throw error
    }
  },

  deleteIssue: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/api/issues/${id}`)
      set((state) => ({
        loading: false,
        items: state.items.filter((i) => i._id !== id),
        selected: state.selected?._id === id ? null : state.selected,
      }))
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message || 'Failed to delete issue.',
      })
      throw error
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await api.get('/api/issues/stats')
      set({ stats: data.counts })
    } catch (_) {}
  },
})
