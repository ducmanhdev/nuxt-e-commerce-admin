import type { FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import schema from '~/schemas/color.schema'

export const useModalColor = () => {
  const isOpen = useState(() => false)
  const storeId = useState<string | undefined>(() => undefined)
  const colorId = useState<string | undefined>(() => undefined)

  const modalTitle = computed(() => colorId.value ? 'Update color' : 'Create color')
  const submitButtonLabel = computed(() => colorId.value ? 'Update' : 'Create')

  type SchemaInfer = z.infer<typeof schema>
  type SchemaOutput = z.output<typeof schema>

  const DEFAULT_STATE: SchemaInfer = {
    name: '',
    value: '#ffffff',
  }

  const state = useState(() => ({ ...DEFAULT_STATE }))

  type ShowArgs = Partial<SchemaInfer> & {
    storeId: string
    id?: string
  }

  const handleShow = ({ storeId: inputStoreId, id, ...args }: ShowArgs) => {
    storeId.value = inputStoreId ?? undefined
    colorId.value = id ?? undefined

    Object.assign(state.value, { ...DEFAULT_STATE, ...args })

    isOpen.value = true
  }

  const handleHide = () => {
    isOpen.value = false
  }

  const {
    isCreateLoading,
    handleCreate,
    isUpdateLoading,
    handleUpdate,
  } = useColor()

  const isSubmitLoading = computed(() => isCreateLoading.value || isUpdateLoading.value)
  const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
    if (!storeId.value) {
      console.error('Store ID is required')
      return
    }

    colorId.value
      ? await handleUpdate({
        storeId: storeId.value,
        colorId: colorId.value,
        payload: event.data,
      })
      : await handleCreate({
        storeId: storeId.value,
        payload: event.data,
      })

    handleHide()
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
