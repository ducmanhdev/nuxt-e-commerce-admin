import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (!user) {
            return createError({
                statusCode: 401,
                message: "Unauthorized",
            })
        }

        const storeId = getRouterParam(event, 'storeId');

        if (!storeId) {
            return createError({
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
            return new Error("Store not found");
        }

        setResponseStatus(event, 204, "No Content");
        return;
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return createError({
            statusCode: 500,
            message: "Internal Server Error",
        })
    }
});
