import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import IssueCard from '../components/IssueCard'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import StatsCard from '../components/StatsCard'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchIssues, fetchStats, setPage } from '../redux/issueSlice'
import api from '../api/axios'

export default function IssueListPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, loading, pagination, stats, filters } = useAppSelector(
    (state) => state.issues
  )
  const [exporting, setExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    dispatch(fetchStats())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchIssues({ q: filters.q }))
  }, [dispatch, filters, pagination.page, pagination.limit])

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      setShowExportMenu(false)
      const response = await api.get('/api/issues/export', {
        params: {
          format,
          q: filters.q || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          severity: filters.severity || undefined,
        },
        responseType: format === 'csv' ? 'blob' : 'json',
      })
      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'issues.csv')
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        const dataStr = JSON.stringify(response.data, null, 2)
        const url = window.URL.createObjectURL(
          new Blob([dataStr], { type: 'application/json' })
        )
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'issues.json')
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.export-dropdown')) {
        setShowExportMenu(false)
      }
    }
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="hero-tag">Issue Tracker</p>
          <h1>Keep every issue on track.</h1>
          <p className="muted">
            Search, filter, resolve, and export with a clean workflow built for
            speed.
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            Create Issue
          </button>
          <div className="export-dropdown">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={exporting}
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              {exporting ? 'Exporting...' : 'Export'}
            </button>
            {showExportMenu && (
              <div className="dropdown-menu">
                <button
                  type="button"
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('json')}
                  disabled={exporting}
                >
                  Export JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="stats-grid">
        <StatsCard label="Open" count={stats.Open || 0} icon="open" />
        <StatsCard label="In Progress" count={stats['In Progress'] || 0} icon="in-progress" />
        <StatsCard label="Resolved" count={stats.Resolved || 0} icon="resolved" />
        <StatsCard label="Closed" count={stats.Closed || 0} icon="closed" />
      </div>

      <FilterBar />

      {loading ? (
        <SkeletonLoader type="list" count={5} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No issues found"
          description={
            filters.q || filters.status || filters.priority || filters.severity
              ? "Try adjusting your filters to see more results."
              : "Get started by creating your first issue."
          }
          action={
            !filters.q && !filters.status && !filters.priority && !filters.severity
              ? {
                  label: 'Create Issue',
                  onClick: () => navigate('/create'),
                }
              : undefined
          }
        />
      ) : (
        <div className="issue-list">
          {items.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => dispatch(setPage(page))}
      />
    </div>
  )
}
