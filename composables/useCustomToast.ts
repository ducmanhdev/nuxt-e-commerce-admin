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
    let finalRest: Options

    if (typeof arg === 'string') {
      finalRest = { description: arg }
    } else if (arg instanceof FetchError) {
      const description =
        arg.data?.data?.issues?.[0]?.message || arg.statusMessage || arg.message || 'An error occurred'
      finalRest = { description }
    } else if (arg instanceof Error) {
      finalRest = { description: arg.message || 'An error occurred' }
    } else {
      finalRest = arg as Options
    }

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
