import { useState } from 'react'

type AuthFormProps = {
  onSubmit: (values: { email: string; password: string }) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

const presets = [
  { email: 'admin@nova.dev', password: 'novaadmin', label: 'Admin' },
  { email: 'staff@nova.dev', password: 'novastaff', label: 'Staff' },
  { email: 'courier@nova.dev', password: 'novacourier', label: 'Courier' },
]

export const AuthForm = ({ onSubmit, isSubmitting = false, errorMessage }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handlePreset = (presetEmail: string, presetPassword: string) => {
    setEmail(presetEmail)
    setPassword(presetPassword)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@nova.dev"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
            required
          />
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick fill:</span>
          {presets.map((preset) => (
            <button
              key={preset.email}
              type="button"
              onClick={() => handlePreset(preset.email, preset.password)}
              className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
