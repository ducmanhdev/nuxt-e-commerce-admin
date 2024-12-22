import type { EventHandler, EventHandlerRequest } from 'h3'
import { createError, H3Error } from 'h3'
import { Prisma } from '@prisma/client'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      return await handler(event)
    } catch (e: unknown) {
      const config = useRuntimeConfig(event)
      const isDev = config.environment !== 'production'
      if (isDev) {
        console.error(error)
        throw e
      }
      if (e instanceof H3Error) {
        throw e
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002': {
            const targetFields = e.meta?.target
            throw createError({
              statusCode: 400,
              statusMessage: 'A record with this unique field already exists.',
              data: { fields: targetFields },
            })
          }
          case 'P2003': {
            const relatedTable = (e.meta?.field_name as string)?.split('_')[0] || 'unknown'
            throw createError({
              statusCode: 400,
              statusMessage: 'Cannot perform this action due to a related record constraint.',
              data: { relatedTable },
            })
          }
          case 'P2025':
            throw createError({
              statusCode: 404,
              statusMessage: 'The record you are trying to access does not exist or has been deleted.',
            })
          case 'P2000':
            throw createError({
              statusCode: 400,
              statusMessage: 'The value provided is too long for the field.',
              data: { details: e.meta },
            })
          case 'P2004':
            throw createError({
              statusCode: 400,
              statusMessage: 'A database constraint was violated.',
              data: { details: e.meta },
            })
          default:
            throw createError({
              statusCode: 500,
              statusMessage: 'An unexpected error occurred with the database.',
              data: { code: e.code },
            })
        }
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation failed. Please check your input.',
          data: { details: e.message },
        })
      }
      if (e instanceof Prisma.PrismaClientRustPanicError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'A critical error occurred with the database. Please try again later.',
        })
      }
      if (e instanceof Prisma.PrismaClientInitializationError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to initialize the database. Please try again later.',
          data: { details: e.message },
        })
      }
      if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'An unknown error occurred with the database. Please try again later.',
          data: { details: e.message },
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: 'An unknown error occurred. Please try again later.',
        data: { details: (e as Error).message || e },
      })
    }
  })
