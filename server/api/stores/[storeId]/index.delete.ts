import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const storeId = getRouterParam(event, 'storeId');

    if (!storeId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Store ID not found or invalid',
        });
    }

    const {count} = await prisma.store.deleteMany({
        where: {
            id: storeId,
            userId: user.id
        },
    });

    if (count === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Store not found',
        })
    }

    setResponseStatus(event, 204);
    return;
});
