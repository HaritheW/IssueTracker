import { Link } from 'react-router-dom'
import type { Issue } from '../utils/types'

const statusClass: Record<string, string> = {
  Open: 'badge-status badge-open',
  'In Progress': 'badge-status badge-progress',
  Resolved: 'badge-status badge-resolved',
  Closed: 'badge-status badge-closed',
}

const priorityClass: Record<string, string> = {
  Low: 'badge-priority badge-low',
  Medium: 'badge-priority badge-medium',
  High: 'badge-priority badge-high',
  Critical: 'badge-priority badge-critical',
}

const severityClass: Record<string, string> = {
  Minor: 'badge-severity badge-severity-minor',
  Major: 'badge-severity badge-severity-major',
  Critical: 'badge-severity badge-severity-critical',
}

const PriorityIcon = () => (
  <svg className="badge-category-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const SeverityIcon = () => (
  <svg className="badge-category-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

type IssueCardProps = {
  issue: Issue
}

export default function IssueCard({ issue }: IssueCardProps) {
  const summary =
    issue.description.length > 120
      ? `${issue.description.slice(0, 120)}...`
      : issue.description
  return (
    <Link to={`/issues/${issue._id}`} className="issue-card">
      <div>
        <h3>{issue.title}</h3>
        <p className="issue-meta">{summary}</p>
      </div>
      <div className="issue-badges">
        <span className={statusClass[issue.status]}>
          <span className="badge-dot" />
          {issue.status}
        </span>
        <span className={priorityClass[issue.priority]}>
          <PriorityIcon />
          <span className="badge-value">{issue.priority}</span>
        </span>
        {issue.severity && (
          <span className={severityClass[issue.severity]}>
            <SeverityIcon />
            <span className="badge-value">{issue.severity}</span>
          </span>
        )}
      </div>
    </Link>
  )
}
