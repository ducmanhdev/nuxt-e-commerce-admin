import { v4 as uuidv4 } from 'uuid'
import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'
import { ACCEPTED_UPLOAD_IMAGE_MIME_TYPES, MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES } from '~/constants'
import { bytesToMB } from '~/utils'

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user
  const supabase = await serverSupabaseClient(event)
  const formData = await readFormData(event)

  const filesSchema = z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith('image/'),
          (file) => ({
            message: `${file.name} is not a valid image file.`,
          }),
        )
        .refine(
          (file) => ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.includes(file.type),
          (file) => ({
            message: `${file.name} is not an acceptable image type.`,
          }),
        )
        .refine(
          (file) => file.size <= MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES,
          (file) => ({
            message: `${file.name} exceeds the maximum file size limit of ${bytesToMB(MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES)} MB.`,
          }),
        ),
    )
    .nonempty('At least one file must be provided.')

  const files = filesSchema.parse(Array.from(formData.getAll('files')))
  const bucketName = z.string().min(1, 'Bucket name cannot be empty.').parse(formData.get('bucketName'))

  const promises = files.map(async (file) => {
    const fileExtension = file.name.split('.').pop()
    const randomFileName = `${uuidv4()}.${fileExtension}`
    const { data, error } = await supabase.storage.from(bucketName).upload(`${user.id}/${randomFileName}`, file)
    if (error) {
      throw error
    }
    return supabase.storage.from(bucketName).getPublicUrl(data.path).data.publicUrl
  })

  const uploadResult = await Promise.all(promises)
  return { data: uploadResult }
})
