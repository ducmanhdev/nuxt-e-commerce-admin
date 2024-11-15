import type { FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import schema from '~/schemas/category.schema'

export const useModalCategory = () => {
  const isOpen = useState(() => false)
  const storeId = useState<string | undefined>(() => undefined)
  const categoryId = useState<string | undefined>(() => undefined)

  const modalTitle = computed(() => (categoryId.value ? 'Update category' : 'Create category'))
  const submitButtonLabel = computed(() => (categoryId.value ? 'Update' : 'Create'))

  type SchemaInfer = z.infer<typeof schema>
  type SchemaOutput = z.output<typeof schema>

  const DEFAULT_STATE: SchemaInfer = {
    name: '',
    billboardId: '',
  }

  const state = useState(() => ({ ...DEFAULT_STATE }))

  type ShowArgs = Partial<SchemaInfer> & {
    storeId: string
    id?: string
  }

  const handleShow = ({ storeId: inputStoreId, id, ...args }: ShowArgs) => {
    storeId.value = inputStoreId ?? undefined
    categoryId.value = id ?? undefined

    Object.assign(state.value, { ...DEFAULT_STATE, ...args })

    isOpen.value = true
  }

  const handleHide = () => {
    isOpen.value = false
  }

  const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionCategory()

  const isSubmitLoading = computed(() => isCreateLoading.value || isUpdateLoading.value)
  const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
    if (!storeId.value) {
      console.error('Store ID is required')
      return
    }

    if (categoryId.value) {
      await handleUpdate({
        storeId: storeId.value,
        categoryId: categoryId.value,
        payload: event.data,
      })
    } else {
      await handleCreate({
        storeId: storeId.value,
        payload: event.data,
      })
    }

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

    storeId,
  }
}
