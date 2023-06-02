import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {userProfileFromToken} from "@/src/utils/MicrosoftLoginUtils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    if (!request.headers.has("Authorization")) {
        return new Response('Missing "Authorization" header', {
            status: 401,
            statusText: 'Missing "Authorization" header'
        });
    }

    const token = request.headers.get("Authorization")!;
    if (token.startsWith("DONT_CRASH")) {
        return new Response('CloudSettings can not be used in dev environments.', {
            status: 401,
            statusText: 'CloudSettings can not be used in dev environments.'
        });
    }

    if (!token.startsWith('ey')) {
        return new Response('Invalid Access Token.', {
            status: 403,
            statusText: 'Invalid Access Token.'
        });
    }

    const userProfile = await userProfileFromToken(token);
    if (!userProfile.success) {
        return new Response('Could not get minecraft profile\n' + userProfile.statusText, {
            status: userProfile.status,
            statusText: userProfile.statusText
        });
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.upsert({
        create: {
            id: userProfile.id,
            name: userProfile.name
        },
        update: {
            name: userProfile.name,
            lastActivity: new Date()
        },
        where: {
            id: userProfile.id
        }
    });

    const Options = await prisma.option.findMany({
        where: {
            userId: user.id
        }
    });

    await prisma.$disconnect();

    return NextResponse.json({
        options: Options.map(option => option.raw)
    });
};

export async function POST(request: NextRequest) {
    if (!request.headers.has("Authorization")) {
        console.log("1")
        return new Response('Missing "Authorization" header', {
            status: 401,
            statusText: 'Missing "Authorization" header'
        });
    }

    const token = request.headers.get("Authorization")!;
    if (token.startsWith("DONT_CRASH")) {
        console.log("2")
        return new Response('CloudSettings can not be used in dev environments.', {
            status: 401,
            statusText: 'CloudSettings can not be used in dev environments.'
        });
    }

    if (!token.startsWith('ey')) {
        console.log("3")
        return new Response('Invalid Access Token.', {
            status: 403,
            statusText: 'Invalid Access Token.'
        });
    }

    const userProfile = await userProfileFromToken(token);
    if (!userProfile.success) {
        console.log("4")
        return new Response('Could not get minecraft profile\n' + userProfile.statusText, {
            status: userProfile.status,
            statusText: userProfile.statusText
        });
    }

    const prisma = new PrismaClient();
    const user = await prisma.user.upsert({
        create: {
            id: userProfile.id,
            name: userProfile.name
        },
        update: {
            name: userProfile.name,
            lastActivity: new Date()
        },
        where: {
            id: userProfile.id
        }
    });

    const body = await request.json();
    const promises: Promise<any>[] = [];
    (body.options as string[]).forEach(option => {
        const id = option.substring(0, option.indexOf(':'));
        promises.push(prisma.option.upsert({
            create: {
                userId: user.id,
                raw: option,
                key: id,
                lastChange: new Date()
            },
            update: {
                raw: option,
                lastChange: new Date()
            },
            where: {
                userId_key: {
                    userId: user.id,
                    key: id
                }
            }
        }));
    });

    await Promise.all(promises);
    return NextResponse.json({});
};
