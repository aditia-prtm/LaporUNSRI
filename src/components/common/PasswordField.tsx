import { FiEye, FiEyeOff } from 'react-icons/fi'

type PasswordFieldProps = {
  value: string
  onChange: (value: string) => void
  mode: 'login' | 'register'
  visible: boolean
  onToggleVisibility: () => void
}

export function PasswordField({ value, onChange, mode, visible, onToggleVisibility }: PasswordFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Password
      </span>
      <div className="relative w-full">
        <input
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-[#f9fafb] px-4 pr-11 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0c4278] focus:outline-none focus:ring-2 focus:ring-[#0c4278]/20 transition"
          type={visible ? 'text' : 'password'}
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'}
        />
        <button
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-transparent text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          type="button"
          aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          aria-pressed={visible}
          onClick={onToggleVisibility}
        >
          {visible ? <FiEyeOff className="size-4" aria-hidden="true" /> : <FiEye className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </label>
  )
}
