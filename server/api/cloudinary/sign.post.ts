import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const { paramsToSign } = (await readBody(event)) as { paramsToSign: Record<string, string> }
  const signature = cloudinary.utils.api_sign_request(paramsToSign, runtimeConfig.cloudinary.apiSecret)
  return {
    signature,
  }
})
