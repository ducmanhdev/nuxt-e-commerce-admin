import type { Toast } from '#ui/composables/useToast'

export function useCustomToast() {
  const toast = useToast()
  type Options = Partial<Toast>

  const success = (arg: string | Options) => {
    toast.add({
      title: 'Success',
      color: 'success',
      icon: 'heroicons:check-circle',
      ...(typeof arg === 'string' ? { description: arg } : arg),
    })
  }

  const error = (arg: string | Options) => {
    toast.add({
      title: 'Error',
      color: 'error',
      icon: 'heroicons:x-circle',
      ...(typeof arg === 'string' ? { description: arg } : arg),
    })
  }

  return {
    ...toast,
    success,
    error,
  }
}
