import { v4 as uuidv4 } from 'uuid'
import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'
import { ACCEPTED_UPLOAD_IMAGE_MIME_TYPES, MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES } from '~/constants'
import { bytesToMB } from '~/utils'

const validateFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    return `${file.name} is not a valid image file.`
  }

  if (!ACCEPTED_UPLOAD_IMAGE_MIME_TYPES.includes(file.type)) {
    return `${file.name} is not an acceptable image type.`
  }

  if (file.size > MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES) {
    return `${file.name} exceeds the maximum file size limit of ${bytesToMB(MAX_UPLOAD_IMAGE_FILE_SIZE_IN_BYTES)} MB.`
  }

  return null
}

export default defineWrappedResponseHandler(async (event) => {
  const user = event.context.user
  const supabase = await serverSupabaseClient(event)
  const formData = await readFormData(event)

  const files = z
    .array(z.instanceof(File))
    .nonempty('At least one file must be provided.')
    .parse(formData.getAll('files'))

  const bucketName = z.string().min(1, 'Bucket name cannot be empty.').parse(formData.get('bucketName'))

  const errors = files.map(validateFile).filter((error) => error !== null)

  if (errors.length) {
    throw createError({
      status: 400,
      statusMessage: errors.join(', '),
    })
  }

  const uploadResult = await Promise.all(
    files.map(async (file) => {
      const fileExtension = file.name.split('.').pop()
      const randomFileName = `${uuidv4()}.${fileExtension}`
      const { data, error } = await supabase.storage.from(bucketName).upload(`${user.id}/${randomFileName}`, file)
      const finalData = error ? null : supabase.storage.from(bucketName).getPublicUrl(data.path).data.publicUrl
      return { data: finalData, error }
    }),
  )

  return { data: uploadResult }
})
