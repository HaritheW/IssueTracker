type TextAreaProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}: TextAreaProps) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  )
}
