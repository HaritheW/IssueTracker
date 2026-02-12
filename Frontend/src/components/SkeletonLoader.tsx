type SkeletonLoaderProps = {
  type?: 'card' | 'detail' | 'list'
  count?: number
}

export default function SkeletonLoader({
  type = 'card',
  count = 1,
}: SkeletonLoaderProps) {
  if (type === 'list') {
    return (
      <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-text" />
            <div className="skeleton-line skeleton-text skeleton-short" />
            <div className="skeleton-badges">
              <div className="skeleton-badge" />
              <div className="skeleton-badge" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="skeleton-detail">
        <div className="skeleton-line skeleton-title-large" />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-grid-item">
              <div className="skeleton-line skeleton-label" />
              <div className="skeleton-line skeleton-value" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-text skeleton-short" />
      <div className="skeleton-badges">
        <div className="skeleton-badge" />
        <div className="skeleton-badge" />
      </div>
    </div>
  )
}
