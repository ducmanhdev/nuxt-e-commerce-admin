import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      // eslint-disable-next-line unicorn/error-message
      throw new Error()
    }
    event.context.user = user
  }
  catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
