import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateUserDto, UserRole } from '@/types/user'

type UserFormProps = {
  onSubmit: (payload: CreateUserDto) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
  validationErrors?: Record<string, string[]>
  defaultValues?: Partial<CreateUserDto>
}

const roles: UserRole[] = ['ADMIN', 'MANAGER', 'CUSTOMER']

const emptyForm: CreateUserDto = {
  name: '',
  email: '',
  role: 'CUSTOMER',
}

export const UserForm = ({
  onSubmit,
  isSubmitting = false,
  errorMessage,
  validationErrors,
  defaultValues,
}: UserFormProps) => {
  const [form, setForm] = useState<CreateUserDto>(emptyForm)

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...defaultValues }))
  }, [defaultValues])

  const handleChange = (
    field: keyof CreateUserDto,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'role' ? (value as UserRole) : value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(form)
  }

  const fieldError = (field: keyof CreateUserDto) =>
    validationErrors?.[field]?.join(', ')

  return (
    <form
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Full name</span>
        <input
          value={form.name}
          onChange={(event) => handleChange('name', event.target.value)}
          placeholder="Jane Doe"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
          required
        />
        {fieldError('name') ? (
          <span className="text-xs text-rose-600">{fieldError('name')}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">E-mail</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
          placeholder="jane@nova.dev"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
          required
        />
        {fieldError('email') ? (
          <span className="text-xs text-rose-600">{fieldError('email')}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 md:col-span-2 md:max-w-xs">
        <span className="text-sm font-medium text-slate-600">Role</span>
        <select
          value={form.role}
          onChange={(event) => handleChange('role', event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
        >
          {roles.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
        {fieldError('role') ? (
          <span className="text-xs text-rose-600">{fieldError('role')}</span>
        ) : null}
      </label>

      {errorMessage ? (
        <div className="md:col-span-2">
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {errorMessage}
          </p>
        </div>
      ) : null}

      <div className="mt-2 md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Saving…' : 'Create user'}
        </button>
      </div>
    </form>
  )
}
