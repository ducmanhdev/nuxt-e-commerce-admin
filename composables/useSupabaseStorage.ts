import { v4 as uuidv4 } from 'uuid'

export const useSupabaseStorage = (bucketName: string) => {
  const config = useRuntimeConfig()

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const isDeleteImagesLoading = ref(false)
  const handleDeleteImages = async (deletedImages: string[]) => {
    try {
      isDeleteImagesLoading.value = true
      const deleteImagePaths = deletedImages.map((image) => image.replace(config.public.supabaseStorageUrl, ''))
      const { data, error } = await supabase.storage.from(bucketName).remove(deleteImagePaths)
      if (error) {
        console.error('Error deleting images:', error.message)
        return
      }
      return data
    } finally {
      isDeleteImagesLoading.value = false
    }
  }

  const isUploadImagesLoading = ref(false)
  const handleUploadImages = async (files: File[]) => {
    try {
      isUploadImagesLoading.value = true
      const uploadPromises = files.map(async (file) => {
        const fileExtension = file.name.split('.').pop()
        const randomFileName = `${uuidv4()}.${fileExtension}`
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(`${user.value?.id}/${randomFileName}`, file)
        if (error) {
          console.error(`Error uploading ${file.name}:`, error.message)
          return ''
        }
        return supabase.storage.from(bucketName).getPublicUrl(data.path).data.publicUrl
      })

      return Promise.all(uploadPromises)
    } finally {
      isUploadImagesLoading.value = false
    }
  }

  return {
    isDeleteImagesLoading,
    handleDeleteImages,
    isUploadImagesLoading,
    handleUploadImages,
  }
}
