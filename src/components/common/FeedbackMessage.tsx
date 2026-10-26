type FeedbackMessageProps = {
  tone: 'success' | 'error' | 'warning'
  children: string
}

export function FeedbackMessage({ tone, children }: FeedbackMessageProps) {
  const role = tone === 'error' ? 'alert' : 'status'
  const toneClass = tone === 'success'
    ? 'border-[#d3eddd] bg-[#f0faf3] text-[#26734f]'
    : tone === 'error'
      ? 'border-[#f2d9d3] bg-[#fff5f2] text-[#a34836]'
      : 'border-[#f1e4c7] bg-[#fffaf0] text-[#83682f]'

  return <div className={`mb-3.5 rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${toneClass}`} role={role}>{children}</div>
}
