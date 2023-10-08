import {NextRequest, NextResponse} from "next/server";
import {ModLoader, PrismaClient} from "@prisma/client";
import {isValid, isValidArray} from "@/src/utils/TypeUtils";

export const dynamic = "force-dynamic";

type ModStatEntry = {
    modId: string
    plattform: "Forge" | "NeoForge" | "Fabric" | "Quilt"
    version: string
}

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

    if (!isValid(body, "stats") || !Array.isArray(body.stats)) {
        return new Response('Missing "stats" field', {
            status: 400,
            statusText: 'Missing "stats" field'
        });
    }

    if (!isValidArray<ModStatEntry>(body.stats, "modId", "plattform", "version")) {
        return new Response('Invalid value in "stats" field', {
            status: 400,
            statusText: 'Invalid value in "stats" field'
        });
    }

    await prisma.modStat.createMany({
        data: body.stats.map(entry => {

            let modLoader: ModLoader
            switch (entry.plattform) {
                case "Fabric":
                    modLoader=ModLoader.FABRIC;
                    break;
                case "Forge":
                    modLoader=ModLoader.FORGE;
                    break;
                case "NeoForge":
                    modLoader=ModLoader.NEO;
                    break;
                case "Quilt":
                    modLoader=ModLoader.QUILT;
                    break;
                default:
                    modLoader=ModLoader.UNKNOWN;
                    break;
            }

            return {
                userId: userId,
                modId: entry.modId,
                version: entry.version,
                modLoader: modLoader
            }
        })
    });

    return NextResponse.json({});
};
