import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  title: string
  description?: string
  type?: ToastType
}

type ToastStore = {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'> & { id?: string }) => string
  dismiss: (id: string) => void
  clear: () => void
}

const createId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9))

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push(toast) {
    const id = toast.id ?? createId()
    const entry: Toast = {
      id,
      title: toast.title,
      description: toast.description,
      type: toast.type,
    }

    set((state) => ({ toasts: [...state.toasts, entry] }))
    return id
  },
  dismiss(id) {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
  clear() {
    set({ toasts: [] })
  },
}))
