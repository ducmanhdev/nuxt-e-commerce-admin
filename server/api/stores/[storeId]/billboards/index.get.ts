import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    try {
        const storeId = getRouterParam(event, 'storeId');
        if (!storeId) {
            return createError({
                statusCode: 404,
                statusMessage: 'Store ID not found or invalid',
            });
        }
        return prisma.billboard.findMany({
            where: {
                storeId: storeId,
            }
        });
    } catch (error) {
        console.log("[BILLBOARDS_GET]", error)
        throw createError({
            statusCode: 500,
            message: "Internal Server Error",
        })
    }
})
