import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import schema from '~/schemas/billboard.schema'

export const useModalBillboard = () => {
  const isOpen = useState(() => false)
  const storeId = useState<string | undefined>(() => undefined)
  const billboardId = useState<string | undefined>(() => undefined)

  const modalTitle = computed(() => (billboardId.value ? 'Update billboard' : 'Create billboard'))
  const submitButtonLabel = computed(() => (billboardId.value ? 'Update' : 'Create'))

  const fileSchema = z.object({
    imageUrl: z.string().optional(),
  })
  const validationSchema = schema.merge(fileSchema)

  type SchemaInfer = z.infer<typeof schema>
  type SchemaOutput = z.output<typeof schema>

  const DEFAULT_STATE: SchemaInfer = {
    name: '',
    imageUrl: '',
  }

  const state = useState(() => ({ ...DEFAULT_STATE }))

  const existingImages = computed<string[]>({
    get() {
      return state.value.imageUrl ? [state.value.imageUrl] : []
    },
    set(value) {
      state.value.imageUrl = value[0]
    },
  })
  const deletedImages = ref<string[]>([])
  const newImageFiles = ref<File[]>([])

  watchEffect(() => {
    console.log('existingImages', existingImages.value)
    console.log('deletedImages', deletedImages.value)
    console.log('newImageFiles', newImageFiles.value)
  })

  type ShowArgs = Partial<SchemaInfer> & {
    storeId: string
    id?: string
  }

  const handleShow = ({ storeId: inputStoreId, id, ...args }: ShowArgs) => {
    storeId.value = inputStoreId ?? undefined
    billboardId.value = id ?? undefined

    Object.assign(state.value, { ...DEFAULT_STATE, ...args })
    isOpen.value = true
  }

  const handleHide = () => {
    isOpen.value = false
  }

  const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionBillboard()

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isWorkingWithSupabase = ref(false)
  const isSubmitLoading = computed(() => isWorkingWithSupabase.value || isCreateLoading.value || isUpdateLoading.value)
  const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
    if (!storeId.value) {
      console.error('Store ID is required')
      return
    }

    isWorkingWithSupabase.value = true
    const BUCKET_NAME = 'billboards'
    if (deletedImages.value.length) {
      const storageUrl = 'https://xzlgkmbsvmmtyegkqucl.supabase.co/storage/v1/object/public/billboards/'
      const deleteImagePaths = deletedImages.value.map((image) => image.replace(storageUrl, ''))
      const { error } = await supabase.storage.from(BUCKET_NAME).remove(deleteImagePaths)
      if (error) {
        console.error('Error deleting images:', error.message)
      }
    }

    if (newImageFiles.value.length) {
      const uploadPromises = newImageFiles.value.map(async (file) => {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(`${user.value?.id}/${file.name}`, file)

        if (error) {
          console.error(`Error uploading ${file.name}:`, error.message)
          return ''
        }

        return supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path).data.publicUrl
      })

      const imagePublicUrls = await Promise.all(uploadPromises)
      event.data.imageUrl = imagePublicUrls[0]
    }

    isWorkingWithSupabase.value = false
    if (billboardId.value) {
      await handleUpdate({
        storeId: storeId.value,
        billboardId: billboardId.value,
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
    schema: validationSchema,
    isSubmitLoading,
    handleSubmit,

    modalTitle,
    submitButtonLabel,

    existingImages,
    deletedImages,
    newImageFiles,
  }
}
