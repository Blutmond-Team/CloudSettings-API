import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import * as crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    let body = await request.json();
    // Assert body has needed content
    if (!body) {
        return new Response('Missing Body', {
            status: 400,
            statusText: 'Missing Body'
        });
    }

    if (!body.hasOwnProperty('uuid') || !body.uuid) {
        return new Response('Missing "uuid" field in Body', {
            status: 400,
            statusText: 'Missing "uuid" field in Body'
        });
    }

    if (!body.hasOwnProperty('username') || !body.username) {
        return new Response('Missing "username" field in Body', {
            status: 400,
            statusText: 'Missing "username" field in Body'
        });
    }

    if (!body.hasOwnProperty('serverId') || !body.serverId) {
        return new Response('Missing "serverId" field in Body', {
            status: 400,
            statusText: 'Missing "serverId" field in Body'
        });
    }

    let uuid: string = body.uuid;
    if (uuid.includes('-')) {
        uuid = uuid.replaceAll('-', '');
    }

    const prisma = new PrismaClient();
    const login = await prisma.login.findFirst({
        where: {
            AND: {
                userId: uuid,
                serverId: body.serverId
            }
        },
        include: {
            user: true
        }
    });

    if (!login) {
        return new Response(`Could not find any login attempt for ${body.serverId}`, {
            status: 404,
            statusText: `Could not find any login attempt for ${body.serverId}`
        });
    }

    const mojangLoginResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/hasJoined?username=${encodeURI(body.username)}&serverId=${encodeURI(login.serverId)}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method: "GET"
    });

    if (!mojangLoginResponse.ok) {
        return new Response(`Mojang declined your request. ${mojangLoginResponse.status}`, {
            status: mojangLoginResponse.status,
            statusText: mojangLoginResponse.statusText
        });
    }

    if (mojangLoginResponse.status === 204) {
        return new Response(`Missing body from mojang response`, {
            status: 401,
            statusText: `Missing body from mojang response`
        });
    }

    const trustedUserProfile = await mojangLoginResponse.json();

    if (trustedUserProfile.id !== uuid) {
        return new Response(`UUID mismatch`, {
            status: 401,
            statusText: `UUID mismatch`
        });
    }

    let userAccessToken = crypto.randomUUID();
    let uniqueCheck = await prisma.loginToken.findFirst({
        where: {
            userId: login.userId,
            token: userAccessToken
        }
    });

    while (uniqueCheck) {
        userAccessToken = crypto.randomUUID();
        uniqueCheck = await prisma.loginToken.findFirst({
            where: {
                token: userAccessToken
            }
        });
    }

    const loginToken = await prisma.loginToken.create({
        data: {
            serverId: login.serverId,
            userId: login.userId,
            token: userAccessToken
        }
    });

    await prisma.user.update({
        data: {
            name: trustedUserProfile.name,
            lastActivity: new Date(),
            verified: true
        },
        where: {
            id: trustedUserProfile.id
        }
    });

    await prisma.$disconnect();

    return NextResponse.json({
        token: loginToken.token
    });
}