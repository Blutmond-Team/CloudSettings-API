import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

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

    const prisma = new PrismaClient();
    const loginData = await prisma.loginToken.findFirst({
        where: {
            token: token
        },
        include: {
            Login: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!loginData || !loginData.Login) {
        return new Response('Invalid Session Token', {
            status: 401,
            statusText: 'Invalid Session Token'
        });
    }

    if (new Date().getTime() - loginData.createdAt.getTime() > 86_400_000) {
        return new Response('Session Token is older than 24 Hours', {
            status: 401,
            statusText: 'Session Token is older than 24 Hours'
        });
    }

    const Options = await prisma.option.findMany({
        where: {
            userId: loginData.Login.user.id,
            blacklisted: false
        }
    });

    await prisma.$disconnect();

    return NextResponse.json({
        options: Options.map(option => option.raw)
    });
};

export async function POST(request: NextRequest) {
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

    const prisma = new PrismaClient();

    const loginData = await prisma.loginToken.findFirst({
        where: {
            token: token
        },
        include: {
            Login: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!loginData || !loginData.Login) {
        return new Response('Invalid Session Token', {
            status: 401,
            statusText: 'Invalid Session Token'
        });
    }

    if (new Date().getTime() - loginData.createdAt.getTime() > 86_400_000) {
        return new Response('Session Token is older than 24 Hours', {
            status: 401,
            statusText: 'Session Token is older than 24 Hours'
        });
    }

    const userId = loginData.Login.user.id;

    const body = await request.json();
    const promises: Promise<any>[] = [];
    (body.options as string[]).forEach(option => {
        const id = option.substring(0, option.indexOf(':'));
        promises.push(prisma.option.upsert({
            create: {
                userId: userId,
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
                    userId: userId,
                    key: id
                }
            }
        }).catch(reason => {
            console.error("Failed to save option", option, "for user", userId, "\nReason:\n", reason);
        }));
    });

    await Promise.all(promises);
    return NextResponse.json({});
};
