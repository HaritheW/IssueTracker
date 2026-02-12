import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmationDialog from '../components/ConfirmationDialog'
import SkeletonLoader from '../components/SkeletonLoader'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  clearSelectedIssue,
  deleteIssue,
  fetchIssueById,
  updateIssue,
} from '../redux/issueSlice'
import type { Issue } from '../utils/types'

const statusClass: Record<string, string> = {
  Open: 'badge badge-open',
  'In Progress': 'badge badge-progress',
  Resolved: 'badge badge-resolved',
  Closed: 'badge badge-closed',
}

const priorityClass: Record<string, string> = {
  Low: 'badge badge-low',
  Medium: 'badge badge-medium',
  High: 'badge badge-high',
  Critical: 'badge badge-critical',
}

const severityClass: Record<string, string> = {
  Minor: 'badge badge-low',
  Major: 'badge badge-medium',
  Critical: 'badge badge-critical',
}

function getCreatorName(issue: Issue): string {
  if (!issue.createdBy) return 'Unknown'
  if (typeof issue.createdBy === 'string') return 'Unknown'
  return issue.createdBy.name || issue.createdBy.email || 'Unknown'
}

function getCreatorEmail(issue: Issue): string | null {
  if (!issue.createdBy || typeof issue.createdBy === 'string') return null
  return issue.createdBy.email || null
}

export default function IssueDetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, loading } = useAppSelector((state) => state.issues)
  const { user } = useAppSelector((state) => state.auth)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState<null | 'Resolved' | 'Closed'>(
    null
  )

  useEffect(() => {
    if (id) dispatch(fetchIssueById(id))
    return () => {
      dispatch(clearSelectedIssue())
    }
  }, [dispatch, id])

  const isCreator =
    selected?.createdBy &&
    user?.id &&
    (typeof selected.createdBy === 'string'
      ? selected.createdBy === user.id
      : selected.createdBy._id === user.id)

  const handleDelete = async () => {
    if (!id) return
    await dispatch(deleteIssue(id))
    navigate('/issues')
  }

  const handleStatusChange = async (status: 'Resolved' | 'Closed') => {
    if (!id) return
    await dispatch(updateIssue({ id, data: { status } }))
    setConfirmStatus(null)
  }

  if (loading || !selected) return <SkeletonLoader type="detail" />

  const creatorName = getCreatorName(selected)
  const creatorEmail = getCreatorEmail(selected)
  const canChangeStatus = selected.status !== 'Resolved' && selected.status !== 'Closed'

  return (
    <div className="page">
      <div className="issue-detail-header">
        <div className="issue-detail-title-section">
          <div className="issue-detail-breadcrumb">
            <Link to="/issues" className="breadcrumb-link">
              Issues
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Details</span>
          </div>
          <h1 className="issue-detail-title">{selected.title}</h1>
          {/* <div className="issue-detail-badges">
            <span className={statusClass[selected.status]}>{selected.status}</span>
            <span className={priorityClass[selected.priority]}>
              {selected.priority}
            </span>
            {selected.severity && (
              <span className={severityClass[selected.severity]}>
                {selected.severity}
              </span>
            )}
          </div> */}
        </div>
        {isCreator && (
          <div className="issue-detail-actions">
            <Link to={`/edit/${selected._id}`} className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setConfirmDelete(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="issue-detail-content">
        <div className="issue-detail-main">
          <div className="issue-detail-description-card">
            <h2 className="section-title">Description</h2>
            <div className="issue-description-text">
              {selected.description.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>

          {canChangeStatus && (
            <div className="issue-detail-status-actions">
              <h3 className="section-subtitle">Quick Actions</h3>
              <div className="status-buttons">
                <button
                  type="button"
                  className="btn btn-status btn-resolved"
                  onClick={() => setConfirmStatus('Resolved')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Mark as Resolved
                </button>
                <button
                  type="button"
                  className="btn btn-status btn-closed"
                  onClick={() => setConfirmStatus('Closed')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Mark as Closed
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="issue-detail-sidebar">
          <div className="info-card">
            <h3 className="info-card-title">Issue Information</h3>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`info-badge ${statusClass[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Priority</span>
              <span className={`info-badge ${priorityClass[selected.priority]}`}>
                {selected.priority}
              </span>
            </div>
            {selected.severity && (
              <div className="info-item">
                <span className="info-label">Severity</span>
                <span className={`info-badge ${severityClass[selected.severity]}`}>
                  {selected.severity}
                </span>
              </div>
            )}
          </div>

          <div className="info-card">
            <h3 className="info-card-title">Created By</h3>
            <div className="creator-info">
              <div className="creator-avatar">
                {creatorName.charAt(0).toUpperCase()}
              </div>
              <div className="creator-details">
                <div className="creator-name">{creatorName}</div>
                {creatorEmail && (
                  <div className="creator-email">{creatorEmail}</div>
                )}
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card-title">Timeline</h3>
            <div className="timeline-item">
              <div className="timeline-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="timeline-content">
                <div className="timeline-label">Created</div>
                <div className="timeline-value">
                  {selected.createdAt
                    ? new Date(selected.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })
                    : '-'}
                </div>
              </div>
            </div>
            {selected.updatedAt && selected.updatedAt !== selected.createdAt && (
              <div className="timeline-item">
                <div className="timeline-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="timeline-content">
                  <div className="timeline-label">Last Updated</div>
                  <div className="timeline-value">
                    {new Date(selected.updatedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmDelete}
        title="Delete issue?"
        description="This action cannot be undone. The issue will be permanently removed."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
      <ConfirmationDialog
        open={Boolean(confirmStatus)}
        title={`Mark as ${confirmStatus}?`}
        description={`Are you sure you want to mark this issue as ${confirmStatus}?`}
        onCancel={() => setConfirmStatus(null)}
        onConfirm={() => {
          if (confirmStatus) handleStatusChange(confirmStatus)
        }}
      />
    </div>
  )
}
