import type { Toast } from '#ui/composables/useToast'
import { FetchError } from 'ofetch'

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

  const error = (arg: string | Options | unknown) => {
    const finalRest: Options =
      typeof arg === 'string'
        ? { description: arg }
        : arg instanceof FetchError
          ? { description: arg.statusMessage || arg.message || 'An error occurred' }
          : arg instanceof Error
            ? { description: arg.message || 'An error occurred' }
            : (arg as Options)

    toast.add({
      title: 'Error',
      color: 'error',
      icon: 'heroicons:x-circle',
      ...finalRest,
    })
  }

  return {
    ...toast,
    success,
    error,
  }
}
