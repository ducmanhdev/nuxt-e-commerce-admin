import type { FormSubmitEvent } from '#ui/types'
import type { z } from 'zod'
import schema from '~/schemas/store.schema'

export const useModalStore = () => {
  const isOpen = useState(() => false)
  const storeId = useState<string | undefined>(() => undefined)
  const modalTitle = computed(() => storeId.value ? 'Update store' : 'Create store')
  const submitButtonLabel = computed(() => storeId.value ? 'Update' : 'Create')

  type SchemaInfer = z.infer<typeof schema>
  type SchemaOutput = z.output<typeof schema>
  const DEFAULT_STATE: SchemaInfer = {
    name: '',
  }
  const state = useState(() => ({ ...DEFAULT_STATE }))

  type ShowArgs = {
    id: string
    name: string
  }
  const handleShow = ({ id, name }: ShowArgs) => {
    storeId.value = id ?? undefined
    state.value.name = name ?? DEFAULT_STATE.name
    isOpen.value = true
  }

  const handleHide = () => {
    isOpen.value = false
  }

  const {
    handleCreateStore,
    isCreateStoreLoading,
    handleUpdateStore,
    isUpdateStoreLoading,
  } = useStore()

  const isSubmitLoading = computed(() => isCreateStoreLoading.value || isUpdateStoreLoading.value)
  const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
    storeId.value
      ? await handleUpdateStore({
        storeId: storeId.value,
        payload: event.data,
      })
      : await handleCreateStore(event.data)

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
