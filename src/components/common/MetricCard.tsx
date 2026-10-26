import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: ReactNode
  description: string
  icon?: ReactNode
  iconClassName?: string
  className?: string
}

export function MetricCard({ label, value, description, icon, iconClassName = '', className = '' }: MetricCardProps) {
  return (
    <article className={`summary-card ${className}`.trim()}>
      {icon && <span className={`summary-icon ${iconClassName}`.trim()}>{icon}</span>}
      <span className="summary-label">{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  )
}
