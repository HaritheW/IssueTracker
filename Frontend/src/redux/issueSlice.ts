import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/axios'
import type { Issue, IssueFilters, Pagination } from '../utils/types'

type IssueState = {
  items: Issue[]
  selected: Issue | null
  filters: IssueFilters
  pagination: Pagination
  stats: Record<string, number>
  loading: boolean
  error: string | null
}

const initialState: IssueState = {
  items: [],
  selected: null,
  filters: { q: '', status: '', priority: '', severity: '' },
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  stats: {},
  loading: false,
  error: null,
}

export const fetchIssues = createAsyncThunk(
  'issues/fetch',
  async (
    payload: { page?: number; limit?: number; q?: string } | undefined,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { issues: IssueState }
      const { filters, pagination } = state.issues
      const params = {
        page: payload?.page ?? pagination.page,
        limit: payload?.limit ?? pagination.limit,
        q: payload?.q ?? filters.q,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        severity: filters.severity || undefined,
      }
      const { data } = await api.get('/api/issues', { params })
      return data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load issues.')
    }
  }
)

export const fetchIssueById = createAsyncThunk(
  'issues/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/issues/${id}`)
      return data.issue as Issue
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load issue.')
    }
  }
)

export const createIssue = createAsyncThunk(
  'issues/create',
  async (payload: Partial<Issue>, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/issues', payload)
      return data.issue as Issue
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create issue.')
    }
  }
)

export const updateIssue = createAsyncThunk(
  'issues/update',
  async (
    payload: { id: string; data: Partial<Issue> },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put(`/api/issues/${payload.id}`, payload.data)
      return data.issue as Issue
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update issue.')
    }
  }
)

export const deleteIssue = createAsyncThunk(
  'issues/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/issues/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete issue.')
    }
  }
)

export const fetchStats = createAsyncThunk(
  'issues/stats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/issues/stats')
      return data.counts as Record<string, number>
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load stats.')
    }
  }
)

const issueSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1
    },
    setPage(state, action) {
      state.pagination.page = action.payload
    },
    setLimit(state, action) {
      state.pagination.limit = action.payload
      state.pagination.page = 1
    },
    clearSelectedIssue(state) {
      state.selected = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.pagination.page = action.payload.page
        state.pagination.limit = action.payload.limit
        state.pagination.total = action.payload.total
        state.pagination.totalPages = action.payload.totalPages
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchIssueById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.loading = false
        state.selected = action.payload
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.loading = false
        state.items = [action.payload, ...state.items]
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.map((issue) =>
          issue._id === action.payload._id ? action.payload : issue
        )
        state.selected =
          state.selected?._id === action.payload._id ? action.payload : state.selected
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((issue) => issue._id !== action.payload)
        state.selected =
          state.selected?._id === action.payload ? null : state.selected
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { setFilters, setPage, setLimit, clearSelectedIssue } =
  issueSlice.actions
export default issueSlice.reducer
