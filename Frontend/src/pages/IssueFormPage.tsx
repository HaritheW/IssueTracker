import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import InputField from '../components/InputField'
import LoadingSpinner from '../components/LoadingSpinner'
import TextArea from '../components/TextArea'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { createIssue, fetchIssueById, updateIssue } from '../redux/issueSlice'
import type {
  IssuePriority,
  IssueSeverity,
  IssueStatus,
} from '../utils/types'

export default function IssueFormPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, loading } = useAppSelector((state) => state.issues)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<IssueStatus>('Open')
  const [priority, setPriority] = useState<IssuePriority>('Medium')
  const [severity, setSeverity] = useState<IssueSeverity>('Minor')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (id) dispatch(fetchIssueById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (id && selected) {
      setTitle(selected.title)
      setDescription(selected.description)
      setStatus(selected.status)
      setPriority(selected.priority)
      setSeverity(selected.severity || 'Minor')
    }
  }, [id, selected])

  const validate = () => {
    const formErrors: Record<string, string> = {}
    if (!title.trim()) formErrors.title = 'Title is required.'
    if (!description.trim()) formErrors.description = 'Description is required.'
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    if (id) {
      await dispatch(
        updateIssue({
          id,
          data: { title, description, status, priority, severity },
        })
      )
      navigate(`/issues/${id}`)
    } else {
      await dispatch(
        createIssue({ title, description, status, priority, severity })
      )
      navigate('/issues')
    }
  }

  if (loading && id && !selected) return <LoadingSpinner />

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit}>
        <h2>{id ? 'Edit Issue' : 'Create Issue'}</h2>
        <InputField
          label="Title"
          name="title"
          value={title}
          onChange={setTitle}
          error={errors.title}
        />
        <TextArea
          label="Description"
          name="description"
          value={description}
          onChange={setDescription}
          error={errors.description}
        />
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as IssueStatus)}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as IssuePriority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            value={severity}
            onChange={(event) =>
              setSeverity(event.target.value as IssueSeverity)
            }
          >
            <option value="Minor">Minor</option>
            <option value="Major">Major</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <Button label={loading ? 'Saving...' : 'Save Issue'} type="submit" />
      </form>
    </div>
  )
}
