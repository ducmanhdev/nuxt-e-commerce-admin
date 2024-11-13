import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  cloudinary.config({
    cloud_name: runtimeConfig.cloudinary.cloudName,
    api_key: runtimeConfig.cloudinary.apiKey,
    api_secret: runtimeConfig.cloudinary.apiSecret,
  })

  const { publicIds } = (await readBody(event)) as { publicIds: string[] }
  const deletePromises = publicIds.map((id) => cloudinary.uploader.destroy(id))
  const results = await Promise.all(deletePromises)
  return { results }
})
