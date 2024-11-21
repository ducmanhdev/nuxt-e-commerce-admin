import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import schema from '~/schemas/billboard.schema'

export const useModalBillboard = () => {
  const isOpen = useState(() => false)
  const storeId = useState<string | undefined>(() => undefined)
  const billboardId = useState<string | undefined>(() => undefined)

  const modalTitle = computed(() => (billboardId.value ? 'Update billboard' : 'Create billboard'))
  const submitButtonLabel = computed(() => (billboardId.value ? 'Update' : 'Create'))

  const validationSchema = schema
    .merge(
      z.object({
        imageUrl: z.string().optional(),
        newImageFiles: z.instanceof(File).array().optional(),
        deletedImages: z.string().array().optional(),
      }),
    )
    .refine((data) => data.imageUrl || data.newImageFiles?.length, {
      message: 'Image must not be empty',
      path: ['imageUrl'],
    })

  type SchemaInfer = z.infer<typeof validationSchema>
  type SchemaOutput = z.output<typeof validationSchema>

  const DEFAULT_STATE: SchemaInfer = {
    name: '',
    imageUrl: '',
    newImageFiles: [],
    deletedImages: [],
  }

  const state = useState<SchemaInfer>(() => ({ ...DEFAULT_STATE }))

  type ShowArgs = Partial<SchemaInfer> & {
    storeId: string
    id?: string
  }

  const handleShow = ({ storeId: inputStoreId, id, ...args }: ShowArgs) => {
    storeId.value = inputStoreId
    billboardId.value = id
    Object.assign(state.value, { ...DEFAULT_STATE, ...args })
    isOpen.value = true
  }

  const handleHide = () => {
    isOpen.value = false
  }

  const { isCreateLoading, handleCreate, isUpdateLoading, handleUpdate } = useActionBillboard()
  const { handleDeleteImages, handleUploadImages } = useSupabaseStorage('billboards')

  const isProcessImageLoading = ref(false)
  const processImages = async (data: SchemaOutput) => {
    try {
      isProcessImageLoading.value = true
      if (data.deletedImages?.length) {
        handleDeleteImages(data.deletedImages).then((data) => console.log({ data }))
      }
      if (data.newImageFiles?.length) {
        const [uploadedImageUrl] = await handleUploadImages(data.newImageFiles)
        return uploadedImageUrl
      }
      return data.imageUrl
    } finally {
      isProcessImageLoading.value = false
    }
  }

  const isSubmitLoading = computed(() => isProcessImageLoading.value || isCreateLoading.value || isUpdateLoading.value)
  const handleSubmit = async (event: FormSubmitEvent<SchemaOutput>) => {
    if (!storeId.value) {
      console.error('Store ID is required')
      return
    }

    const imageUrl = await processImages(event.data)
    if (!imageUrl) {
      push.error('Something went wrong with image processing')
      return
    }

    const payload = {
      name: event.data.name,
      imageUrl,
    }

    try {
      if (billboardId.value) {
        await handleUpdate({ storeId: storeId.value, billboardId: billboardId.value, payload })
      } else {
        await handleCreate({ storeId: storeId.value, payload })
      }
      handleHide()
    } catch (error) {
      push.error('Failed to save billboard')
    }
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
  }
}
