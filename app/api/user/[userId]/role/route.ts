import {NextRequest, NextResponse} from "next/server";
import {PrismaClient, Role} from "@prisma/client";
import {getToken} from "next-auth/jwt";
import {CloudSettingsToken} from "@/src/types/AuthTypes";

export async function POST(request: NextRequest, {params}: RouteContext<"/api/user/[userId]/role">) {
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

    const {userId} = await params;
    if (!userId) {
        return new Response("Target user not found.", {
            status: 404,
            statusText: "Target user not found."
        });
    }

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    });

    if (!user) {
        return new Response("Target user not found.", {
            status: 404,
            statusText: "Target user not found."
        });
    }

    const body = await request.json();
    const newRole = body.role;
    if (!newRole) {
        return new Response("Missing 'role' element in payload.", {
            status: 400,
            statusText: "Missing 'role' element in payload."
        });
    }

    if (!Object.hasOwn(Role, newRole)) {
        return new Response("'role' element in payload is invalid.", {
            status: 400,
            statusText: "'role' element in payload is invalid."
        });
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            role: newRole
        }
    });

    await prisma.$disconnect();

    return NextResponse.json({});
};
