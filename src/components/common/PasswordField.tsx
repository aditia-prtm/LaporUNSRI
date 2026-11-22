import { FiEye, FiEyeOff } from 'react-icons/fi'
import type { UseFormRegisterReturn } from 'react-hook-form'

type PasswordFieldProps = {
  mode: 'login' | 'register'
  visible: boolean
  onToggleVisibility: () => void
  error?: string
  registration?: UseFormRegisterReturn
  value?: string
  onChange?: (value: string) => void
}

export function PasswordField({
  value,
  onChange,
  mode,
  visible,
  onToggleVisibility,
  error,
  registration,
}: PasswordFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200/80">
        Password
      </span>
      <div className="relative w-full">
        <input
          {...(registration ?? {
            value,
            onChange: (event) => onChange?.(event.target.value),
          })}
          required
          className={`h-12 w-full rounded-xl border bg-white/10 px-4 pr-11 text-sm font-normal text-white placeholder:text-sky-200/50 focus:bg-white/15 focus:outline-none transition ${
            error
              ? 'border-rose-400/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25'
              : 'border-white/20 focus:border-[#ffbb00] focus:ring-2 focus:ring-[#ffbb00]/25'
          }`}
          type={visible ? 'text' : 'password'}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'}
        />
        <button
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-transparent text-sky-200/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
          type="button"
          aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          aria-pressed={visible}
          onClick={onToggleVisibility}
        >
          {visible ? <FiEyeOff className="size-4" aria-hidden="true" /> : <FiEye className="size-4" aria-hidden="true" />}
        </button>
      </div>

      {error && (
        <span className="text-[11px] font-medium text-rose-300 mt-0.5 flex items-center gap-1">
          <span>•</span> {error}
        </span>
      )}
    </label>
  )
}
