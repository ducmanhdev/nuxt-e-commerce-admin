import type { FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import schema from '~/schemas/billboard.schema'

export function useModalBillboard() {
  const isOpen = useState(() => false)
  const modalTitle = computed(() => true ? 'Create billboard' : 'Update billboard')
  const submitButtonLabel = computed(() => true ? 'Create billboard' : 'Update billboard')
  const successToastMessage = computed(() => true ? 'Create billboard successfully' : 'Update billboard successfully')

    type SchemaInfer = z.infer<typeof schema>
    type SchemaOutput = z.output<typeof schema>

    const DEFAULT_STATE: Partial<SchemaInfer> = {
      label: undefined,
      imageUrl: undefined,
    }
    const state = useState(() => ({ ...DEFAULT_STATE }))

    interface ShowArgs {
      storeId: string
      id?: string
      label?: string
      imageUrl?: string
    }
    const storeId = useState<ShowArgs['storeId'] | undefined>()
    const billboardId = useState<ShowArgs['id'] | undefined>()

    const handleShow = (args: ShowArgs) => {
      storeId.value = args.storeId ?? undefined
      billboardId.value = args.id ?? undefined
      state.value = {
        label: args.label ?? DEFAULT_STATE.label,
        imageUrl: args.imageUrl ?? DEFAULT_STATE.imageUrl,
      }
      isOpen.value = true
    }

    const handleHide = () => {
      isOpen.value = false
    }

    const isSubmitLoading = useState(() => false)
    const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
      try {
        isSubmitLoading.value = true
        await $fetch(`/api/stores/${storeId.value}/billboards`, {
          method: 'POST',
          body: {
            label: event.data.label,
            imageUrl: event.data.imageUrl,
          },
        })
        await refreshNuxtData('billboards')
        push.success(successToastMessage.value)
        handleHide()
      }
      catch (error: any) {
        console.log(error)
        push.error(error.statusMessage || 'Something went wrong')
      }
      finally {
        isSubmitLoading.value = false
      }
    }

    return {
      isOpen,
      handleShow,
      handleHide,
      state,
      schema,
      isSubmitLoading,
      handleSubmit,

      modalTitle,
      submitButtonLabel,
    }
}
