import { useEffect, useState } from 'react'
import { useIssueStore } from '../store/zustandStore'
import useDebounce from '../utils/useDebounce'

export default function FilterBar() {
  const filters = useIssueStore((state) => state.filters)
  const setFilters = useIssueStore((state) => state.setFilters)
  const [search, setSearch] = useState(filters.q)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    setFilters({ q: debouncedSearch })
  }, [debouncedSearch, setFilters])

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search title or description..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        value={filters.status}
        onChange={(event) => setFilters({ status: event.target.value })}
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>
      <select
        value={filters.priority}
        onChange={(event) => setFilters({ priority: event.target.value })}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <select
        value={filters.severity}
        onChange={(event) => setFilters({ severity: event.target.value })}
      >
        <option value="">All Severity</option>
        <option value="Minor">Minor</option>
        <option value="Major">Major</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
  )
}
