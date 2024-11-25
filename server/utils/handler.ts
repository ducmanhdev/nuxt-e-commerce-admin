import { createError, EventHandler, EventHandlerRequest, H3Error } from 'h3'
import { Prisma } from '@prisma/client'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      return await handler(event)
    } catch (e: unknown) {
      if (e instanceof H3Error) {
        throw e
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
            throw createError({
              statusCode: 400,
              statusMessage: `A record with this unique field already exists. Details: ${JSON.stringify(e.meta)}`,
            })

          case 'P2003':
            const relatedTable = (e.meta?.field_name as string)?.split('_')[0] || 'unknown'
            throw createError({
              statusCode: 400,
              statusMessage: `Cannot perform this action due to foreign key constraint. Related table: ${relatedTable}`,
            })

          case 'P2025':
            throw createError({
              statusCode: 404,
              statusMessage: `The record you are trying to access does not exist or has been deleted.`,
            })

          case 'P2000':
            throw createError({
              statusCode: 400,
              statusMessage: `The value provided is too long for the field. Details: ${JSON.stringify(e.meta)}`,
            })

          case 'P2004':
            throw createError({
              statusCode: 400,
              statusMessage: `A database constraint was violated. Details: ${JSON.stringify(e.meta)}`,
            })

          default:
            throw createError({
              statusCode: 500,
              statusMessage: `An unexpected error occurred with Prisma. Code: ${e.code}`,
            })
        }
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw createError({
          statusCode: 422,
          statusMessage: `Validation failed. Details: ${e.message}`,
        })
      }
      if (e instanceof Prisma.PrismaClientRustPanicError) {
        throw createError({
          statusCode: 500,
          statusMessage: `A critical error occurred with Prisma. Please contact support.`,
        })
      }
      if (e instanceof Prisma.PrismaClientInitializationError) {
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to initialize the Prisma Client. Details: ${e.message}`,
        })
      }
      if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        throw createError({
          statusCode: 500,
          statusMessage: `An unknown error occurred with the Prisma Client. Details: ${e.message}`,
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: `An unknown error occurred. Details: ${(e as Error).message || e}`,
      })
    }
  })
