type FeedbackMessageProps = {
  tone: 'success' | 'error' | 'warning'
  children: string
}

export function FeedbackMessage({ tone, children }: FeedbackMessageProps) {
  const role = tone === 'error' ? 'alert' : 'status'
  const toneClass = tone === 'success'
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
    : tone === 'error'
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
      : 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]'

  return (
    <div
      className={`mb-4 rounded-xl border px-3.5 py-2.5 text-xs font-medium leading-relaxed backdrop-blur-md transition-all ${toneClass}`}
      role={role}
    >
      {children}
    </div>
  )
}
