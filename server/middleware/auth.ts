import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api')) return
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw new Error('')
    }
    event.context.user = user
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
})
