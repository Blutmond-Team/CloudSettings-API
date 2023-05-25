import Hero2x2Grid from "@/app/Hero2x2Grid";
import {
    ArrowDownOnSquareIcon,
    CircleStackIcon,
    CloudArrowUpIcon,
    EyeSlashIcon,
    LockClosedIcon,
    UserGroupIcon, UsersIcon
} from "@heroicons/react/24/outline";
import UsageStats from "@/app/UsageStats";
import {PrismaClient} from "@prisma/client";
import * as process from "process";
import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";

export default async function Home() {
    const data = await getData();
    return (
        <>
            <Hero2x2Grid
                noteText={"Play better with"}
                title={"CloudSettings"}
                description={"A simple mod with synchronizes your Minecraft options with all of your Modpacks no matter where you are."}
                items={[
                    {
                        name: 'Stored in Cloud',
                        description: 'Your settings will be stored in a cloud storage hosted by BisectHosting.',
                        icon: CloudArrowUpIcon,
                    },
                    {
                        name: 'Secure Communication',
                        description: 'The communication with the cloud storage is fully ssl encrypted.',
                        icon: LockClosedIcon,
                    },
                    {
                        name: 'Open Source',
                        description: 'This Web App as well as the actual mod are open source projects supported by BisectHosting.',
                        icon: UserGroupIcon,
                    },
                    {
                        name: 'Privacy Respecting',
                        description: "We're only interested in making your live easier therefor we just use your Minecraft UUID, Minecraft Name and the single line of impacted option. No more Data is stored.",
                        icon: EyeSlashIcon,
                    }
                ]}
            />
            <div className={"px-10 pt-5 lg:px-20 xl:px-[7.5rem] 2xl:px-[12.5rem]"}>
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
            method: "GET"
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
                "Accept": "application/json",
                "User-Agent:": "cloud settings web app (cloudsettings.blutmondgilde.de)",
                "Authorization": process.env.MODRINTH_API_KEY
            },
            method: "GET"
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