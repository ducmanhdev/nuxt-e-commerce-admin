import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
    const storeId = getRouterParam(event, 'storeId');

    if (!storeId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Store ID not found or invalid',
        });
    }

    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        },
    });

    if (!store) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Store not found',
        });
    }

    return store;
});
