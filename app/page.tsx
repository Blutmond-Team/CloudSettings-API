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
import ButtonWithIcon from "@/app/ButtonWithIcon";

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
                bottomRow={
                    <>
                        <ButtonWithIcon
                            text={"Download on Modrinth"}
                            size={"large"}
                            icon={classNames => (
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 512 514"
                                     data-v-ecce9fa8=""
                                     className={classNames}
                                >
                                    <path fill="currentColor" fillRule="evenodd"
                                          d="M503.16 323.56c11.39-42.09 12.16-87.65.04-132.8C466.57 54.23 326.04-26.8 189.33 9.78 83.81 38.02 11.39 128.07.69 230.47h43.3c10.3-83.14 69.75-155.74 155.76-178.76 106.3-28.45 215.38 28.96 253.42 129.67l-42.14 11.27c-19.39-46.85-58.46-81.2-104.73-95.83l-7.74 43.84c36.53 13.47 66.16 43.84 77 84.25 15.8 58.89-13.62 119.23-67 144.26l11.53 42.99c70.16-28.95 112.31-101.86 102.34-177.02l41.98-11.23a210.18 210.18 0 0 1-3.86 84.16l42.61 15.49Z"
                                          clipRule="evenodd"></path>
                                    <path fill="currentColor"
                                          d="M321.99 504.22C185.27 540.8 44.75 459.77 8.11 323.24A257.556 257.556 0 0 1 0 275.46h43.27c1.09 11.91 3.2 23.89 6.41 35.83 3.36 12.51 7.77 24.46 13.11 35.78l38.59-23.15c-3.25-7.5-5.99-15.32-8.17-23.45-24.04-89.6 29.2-181.7 118.92-205.71 17-4.55 34.1-6.32 50.8-5.61L255.19 133c-10.46.05-21.08 1.42-31.66 4.25-66.22 17.73-105.52 85.7-87.78 151.84 1.1 4.07 2.38 8.04 3.84 11.9l49.35-29.61-14.87-39.43 46.6-47.87 58.9-12.69 17.05 20.99-27.15 27.5-23.68 7.45-16.92 17.39 8.29 23.07s16.79 17.84 16.82 17.85l23.72-6.31 16.88-18.54 36.86-11.67 10.98 24.7-38.03 46.63-63.73 20.18-28.58-31.82-49.82 29.89c25.54 29.08 63.94 45.23 103.75 41.86l11.53 42.99c-59.41 7.86-117.44-16.73-153.49-61.91l-38.41 23.04c50.61 66.49 138.2 99.43 223.97 76.48 61.74-16.52 109.79-58.6 135.81-111.78l42.64 15.5c-30.89 66.28-89.84 118.94-166.07 139.34Z"></path>
                                </svg>
                            )}
                            href={"https://modrinth.com/mod/cloudsettings"}
                            className={"bg-malachite-600 hover:bg-malachite-700 transition-colors"}
                        />
                        <ButtonWithIcon
                            text={"Download on CurseForge"}
                            size={"large"}
                            icon={classNames => (
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     version="1.1"
                                     id="Layer_2"
                                     x="0px"
                                     y="0px"
                                     viewBox="-2017 853 43 23"
                                     className={classNames}
                                     fill={"currentColor"}
                                >
                                    <path
                                          d="M-2005.7,853l0.7,3c-3.5,0-12,0-12,0s0.2,0.9,0.3,1c0.3,0.5,0.6,1.1,1,1.5c1.9,2.2,5.2,3.1,7.9,3.6  c1.9,0.4,3.8,0.5,5.7,0.6l2.2,5.9h1.2l0.7,1.9h-1l-1.7,5.5h16.7l-1.7-5.5h-1l0.7-1.9h1.2c0,0,1-6.1,4.1-8.9c3-2.8,6.7-3.2,6.7-3.2  V853H-2005.7z M-1988.9,868.1c-0.8,0.5-1.7,0.5-2.3,0.9c-0.4,0.2-0.6,0.8-0.6,0.8c-0.4-0.9-0.9-1.2-1.5-1.4  c-0.6-0.2-1.7-0.1-3.2-1.4c-1-0.9-1.1-2.1-1-2.7v-0.1c0-0.1,0-0.1,0-0.2s0-0.2,0.1-0.3l0,0l0,0c0.2-0.6,0.7-1.2,1.7-1.6  c0,0-0.7,1,0,2c0.4,0.6,1.2,0.9,1.9,0.5c0.3-0.2,0.5-0.6,0.6-0.9c0.2-0.7,0.2-1.4-0.4-1.9c-0.9-0.8-1.1-1.9-0.5-2.6  c0,0,0.2,0.9,1.1,0.8c0.6,0,0.6-0.2,0.4-0.4c-0.1-0.3-1.4-2.2,0.5-3.6c0,0,1.2-0.8,2.6-0.7c-0.8,0.1-1.7,0.6-2,1.4c0,0,0,0,0,0.1  c-0.3,0.8-0.1,1.7,0.5,2.5c0.4,0.6,0.9,1.1,1.1,1.9c-0.3-0.1-0.5,0-0.7,0.2c-0.2,0.2-0.3,0.6-0.2,0.9c0.1,0.2,0.3,0.4,0.5,0.4  c0.1,0,0.1,0,0.2,0h0.1c0.3-0.1,0.5-0.5,0.4-0.8c0.2,0.2,0.3,0.7,0.2,1c0,0.3-0.2,0.6-0.3,0.8c-0.1,0.2-0.3,0.4-0.4,0.6  s-0.2,0.4-0.2,0.6c0,0.2,0,0.5,0.1,0.7c0.4,0.6,1.2,0,1.4-0.5c0.3-0.6,0.2-1.3-0.2-1.9c0,0,0.7,0.4,1.2,1.8  C-1987.4,866.2-1988.1,867.6-1988.9,868.1z"/>
                                </svg>
                            )}
                            href={"https://legacy.curseforge.com/minecraft/mc-mods/cloudsettings"}
                            className={"bg-flamingo hover:bg-flamingo-600 transition-colors"}
                        />
                    </>
                }
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