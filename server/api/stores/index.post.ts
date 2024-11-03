import prisma from "~/lib/prisma";
import storeSchema from "~/schemas/store.schema";

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (!user) {
            return createError({
                statusCode: 401,
                message: "Unauthorized",
            })
        }

        const {name} = await readValidatedBody(event, storeSchema.parse);
        return prisma.store.create({
            data: {
                name,
                userId: user.id,
            }
        });
    } catch (error) {
        console.log("[STORES_POST]", error)
        throw createError({
            statusCode: 500,
            message: "Internal Server Error",
        })
    }
})
