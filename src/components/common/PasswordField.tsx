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
    <label>
      Kata sandi
      <div className="relative w-full">
        <input
          required
          className="h-11 w-full rounded-lg border border-[#dfe7e2] bg-white px-[13px] pr-11 text-xs font-normal text-[var(--ink)] placeholder:text-[#a9b3ae] focus:border-[#70b693] focus:outline focus:outline-[3px] focus:outline-[#e4f4eb]"
          type={visible ? 'text' : 'password'}
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'}
        />
        <button
          className="absolute right-[7px] top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md bg-transparent text-[17px] text-[#82918a] hover:bg-[#f0f6f2] hover:text-[var(--green)]"
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
