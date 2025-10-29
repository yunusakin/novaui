import { useToastStore } from '@/store/toastStore'

export const useToast = () => {
  const push = useToastStore((state) => state.push)

  return {
    push,
    success: (title: string, description?: string) =>
      push({ title, description, type: 'success' }),
    error: (title: string, description?: string) =>
      push({ title, description, type: 'error' }),
    info: (title: string, description?: string) =>
      push({ title, description, type: 'info' }),
  }
}
