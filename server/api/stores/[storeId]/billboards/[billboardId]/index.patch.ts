export default defineEventHandler(async (event) => {
    const storeId = getRouterParam(event, 'storeId');
    if (!storeId) {
        return createError({
            statusCode: 404,
            statusMessage: 'Store ID not found or invalid',
        });
    }
    return 'Updated'
})
