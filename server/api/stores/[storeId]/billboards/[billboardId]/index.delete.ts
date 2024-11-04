import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const {storeId, billboardId} = getRouterParams(event);
    if (!storeId) {
        return createError({
            statusCode: 404,
            statusMessage: 'Store ID not found or invalid',
        });
    }

    if (!billboardId) {
        return createError({
            statusCode: 404,
            statusMessage: 'Billboard ID not found or invalid',
        });
    }

    const {count} = await prisma.billboard.deleteMany({
        where: {
            storeId,
            id: billboardId,
        }
    });

    if (count === 0) {
        return new Error("Billboard not found");
    }

    setResponseStatus(event, 204, "No Content");
    return;
})
