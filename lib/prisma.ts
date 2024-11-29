import { PrismaClient } from '@prisma/client'
import { pagination } from './extensions'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(pagination)
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
