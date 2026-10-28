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
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb]">
      <span>Kata sandi</span>
      <div className="relative w-full">
        <input
          required
          className="h-11 w-full rounded-xl border border-white/15 bg-[#031528]/80 px-3.5 pr-11 text-xs font-normal text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25"
          type={visible ? 'text' : 'password'}
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'}
        />
        <button
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg bg-transparent text-sm text-[#8cb6dc] transition hover:bg-white/10 hover:text-white"
          type="button"
          aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          aria-pressed={visible}
          onClick={onToggleVisibility}
        >
          {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
      </div>
    </label>
  )
}
