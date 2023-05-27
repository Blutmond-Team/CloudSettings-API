import SettingsTable from "@/app/profile/SettingsTable";
import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
    const data = await getData();
    return (
        <div className={"flex justify-center"}>
            <div className={"max-w-screen-xl flex-grow"}>
                <SettingsTable
                    title={"Stored Options"}
                    description={"A list of all stored options. Be careful when editing them!"}
                    items={data.options.map(option => {
                        return {
                            key: option.key,
                            value: option.raw.substring((option.raw.indexOf(':') + 1)),
                            //lastChanged: option.lastChange
                        }
                    })}
                />
            </div>
        </div>
    )
}

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return {
            options: []
        }
    }

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) {
        return {
            options: []
        }
    }

    const prisma = new PrismaClient();
    const options = await prisma.option.findMany({
        where: {
            userId: cloudSettingsSession.minecraft.uuid
        }
    });

    return {
        options: options
    }
}