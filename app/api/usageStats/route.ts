import {PrismaClient} from "@prisma/client";
import {UsageStats} from "@/src/types/ApiTypes";

const prisma = new PrismaClient();

export async function GET() {
    let totalDownloads = 0;

    if (process.env.CURSEFORGE_API_KEY) {
        const response = await fetch('https://api.curseforge.com/v1/mods/622165', {
            headers: {
                "Accept": "application/json",
                "x-api-key": process.env.CURSEFORGE_API_KEY
            },
            method: "GET",
            next: {
                revalidate: 30
            }
        });
        if (response.ok) {
            const body = await response.json();
            const downloadCount = body.data.downloadCount as number;
            totalDownloads += downloadCount;
        } else {
            console.error("Error on loading CurseForge Download Count", {
                status: response.status,
                statusText: response.statusText
            })
        }
    }

    if (process.env.MODRINTH_API_KEY) {
        const response = await fetch('https://api.modrinth.com/v2/project/nnu4dJj4', {
            headers: {
                "Authorization": process.env.MODRINTH_API_KEY
            },
            method: "GET",
            next: {
                revalidate: 30
            }
        });
        if (response.ok) {
            const body = await response.json();
            const downloadCount = body.downloads as number;
            totalDownloads += downloadCount;
        } else {
            console.error("Error on loading Modrinth Download Count", {
                status: response.status,
                statusText: response.statusText
            })
        }
    }

    return Response.json({
        userCount: await prisma.user.count(),
        optionsCount: await prisma.option.count(),
        totalDownloads: totalDownloads
    } as UsageStats);
}

