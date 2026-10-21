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
      <div className="password-input-wrap">
        <input
          required
          type={visible ? 'text' : 'password'}
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'}
        />
        <button
          className="password-visibility"
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
