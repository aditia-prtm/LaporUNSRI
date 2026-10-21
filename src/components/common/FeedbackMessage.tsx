type FeedbackMessageProps = {
  tone: 'success' | 'error' | 'warning'
  children: string
}

export function FeedbackMessage({ tone, children }: FeedbackMessageProps) {
  const role = tone === 'error' ? 'alert' : 'status'
  return <div className={`message message-${tone}`} role={role}>{children}</div>
}
