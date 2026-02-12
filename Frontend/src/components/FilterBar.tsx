import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setFilters } from '../redux/issueSlice'
import useDebounce from '../utils/useDebounce'

export default function FilterBar() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.issues.filters)
  const [search, setSearch] = useState(filters.q)
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    dispatch(setFilters({ q: debouncedSearch }))
  }, [debouncedSearch, dispatch])

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
        onChange={(event) => dispatch(setFilters({ status: event.target.value }))}
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>
      <select
        value={filters.priority}
        onChange={(event) => dispatch(setFilters({ priority: event.target.value }))}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <select
        value={filters.severity}
        onChange={(event) => dispatch(setFilters({ severity: event.target.value }))}
      >
        <option value="">All Severity</option>
        <option value="Minor">Minor</option>
        <option value="Major">Major</option>
        <option value="Critical">Critical</option>
      </select>
    </div>
  )
}
