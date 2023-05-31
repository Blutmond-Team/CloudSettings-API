import {NextRequest, NextResponse} from "next/server";
import {PrismaClient, Role} from "@prisma/client";
import {getToken} from "next-auth/jwt";
import {CloudSettingsToken} from "@/src/types/AuthTypes";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest, {params}: { params: { userId: string } }) {
    const nextAuthToken = await getToken({req: request}) as CloudSettingsToken;
    if (!nextAuthToken) {
        return new Response("No valid session token found.", {
            status: 401,
            statusText: "No valid session token found."
        });
    }

    if (!nextAuthToken.minecraftUUID) {
        return new Response("No valid session token found. Missing Minecraft data.", {
            status: 401,
            statusText: "No valid session token found. Missing Minecraft data."
        });
    }

    const prisma = new PrismaClient();
    const requestUser = await prisma.user.findFirst({
        where: {
            id: nextAuthToken.minecraftUUID
        }
    });

    if (!requestUser) {
        return new Response("No User found with the given id.", {
            status: 401,
            statusText: "No User found with the given id."
        });
    }

    if (requestUser.role !== "MODERATOR" && requestUser.role !== "ADMIN") {
        return new Response("No Permission to do that.", {
            status: 401,
            statusText: "No Permission to do that."
        });
    }

    const user = await prisma.user.findFirst({
        where: {
            id: params.userId
        }
    });

    if (!user) {
        return new Response("Target user not found.", {
            status: 404,
            statusText: "Target user not found."
        });
    }

    await prisma.user.delete({
        where: {
            id: user.id
        }
    });

    return NextResponse.json({});
};