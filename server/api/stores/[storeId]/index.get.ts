import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
    try {
        const storeId = getRouterParam(event, 'storeId');

        if (!storeId) {
            return createError({
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
            return createError({
                statusCode: 404,
                statusMessage: 'Store not found',
            });
        }

        return store;
    } catch (error) {
        console.log("[STORE_GET]", error);
        throw createError({
            statusCode: 500,
            message: "Internal Server Error",
        })
    }
});
