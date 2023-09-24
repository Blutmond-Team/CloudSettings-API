import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {mcHexDigest} from "@/src/utils/MicrosoftLoginUtils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const body = await request.json();
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
    let uuid: string = body.uuid;
    if (uuid.includes('-')) {
        uuid = uuid.replaceAll('-', '');
    }

    // Store Server id in Database
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
        where: {
            id: uuid
        },
        include: {
            Logins: true
        }
    });

    // Generate Server id
    const serverId = mcHexDigest(body.username);

    if (!user) {
        await prisma.user.create({
            data: {
                id: uuid,
                name: body.username,
                Logins: {
                    create: [
                        {
                            serverId: serverId
                        }
                    ]
                }
            }
        });
    } else {
        await prisma.login.upsert({
            create: {
                serverId: serverId,
                userId: user.id,
            },
            update: {},
            where: {
                serverId_userId: {
                    serverId: serverId,
                    userId: user.id
                }
            }
        });
    }

    await prisma.$disconnect();

    // send response
    return NextResponse.json({
        serverId: serverId
    });
}