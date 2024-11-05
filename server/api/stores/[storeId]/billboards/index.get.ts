import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const storeId = getRouterParam(event, 'storeId');
    if (!storeId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Store ID not found or invalid',
        });
    }
    return prisma.billboard.findMany({
        where: {
            storeId: storeId,
        }
    });
})
