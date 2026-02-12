export type User = {
  id: string
  name?: string
  email: string
}

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type IssueSeverity = 'Minor' | 'Major' | 'Critical'

export type Issue = {
  _id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  severity?: IssueSeverity
  createdBy?: string | { _id: string; name?: string; email: string }
  createdAt?: string
  updatedAt?: string
}

export type IssueFilters = {
  q: string
  status: string
  priority: string
  severity: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}
