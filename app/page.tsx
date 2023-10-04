import {ArrowDownOnSquareIcon, CircleStackIcon, UsersIcon} from "@heroicons/react/24/outline";
import UsageStats from "@/app/UsageStats";
import {PrismaClient} from "@prisma/client";
import {HeroCard} from "@/components/home/HeroCard";

export default async function Home() {
    const data = await getData();
    return (
        <>
            <HeroCard/>
            <div className={"px-10 pt-5 lg:px-20 xl:px-[7.5rem] 2xl:px-[12.5rem] bg-transparent"}>
                <UsageStats
                    items={[
                        {id: 1, name: 'Registered Users', stat: `${data.userCount}`, icon: UsersIcon},
                        {id: 2, name: 'Stored Options', stat: `${data.optionsCount}`, icon: CircleStackIcon},
                        {id: 3, name: 'Total Downloads', stat: `${data.totalDownloads}`, icon: ArrowDownOnSquareIcon}
                    ]}
                />
            </div>
        </>
    )
};

async function getData() {
    const prisma = new PrismaClient();
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

    return {
        userCount: await prisma.user.count(),
        optionsCount: await prisma.option.count(),
        totalDownloads: totalDownloads
    }
}

export const revalidate = 60;