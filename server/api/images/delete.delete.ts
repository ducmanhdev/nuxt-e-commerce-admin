import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

export default defineWrappedResponseHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const supabaseUrl = config.public.supabase.url

  const schema = z.object({
    imageUrls: z
      .array(z.string())
      .nonempty('At least one file must be provided.')
      .refine((urls) => urls.every((url) => url.startsWith(supabaseUrl)), {
        message: `Each file URL must start with ${supabaseUrl}.`,
      }),
    bucketName: z.string().min(1, 'Bucket name cannot be empty.'),
  })

  const supabase = await serverSupabaseClient(event)
  const { imageUrls, bucketName } = await readValidatedBody(event, schema.parse)

  const imageUrlPaths = imageUrls.map((url) => url.split(`${bucketName}/`)[1])

  const { data, error } = await supabase.storage.from(bucketName).remove(imageUrlPaths)
  if (error) {
    throw createError({
      status: 500,
      statusMessage: `Error removing files: ${error.message}`,
    })
  }
  return { data }
})
