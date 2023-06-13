import SettingsTable from "@/app/profile/SettingsTable";
import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {DeleteAccountButton} from "@/app/profile/DeleteAccountButton";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export default async function Home() {
    async function revalidatePage(){
        "use server";
        revalidatePath('/profile');
    }
    const data = await getData();

    return (
        <div className={""}>
            <div className={"max-w-screen-xl flex-grow mx-auto mb-4"}>
                <div className={"px-4 sm:px-6 lg:px-8"}>
                    <h1 className={"font-semibold leading-6 text-pale-900 dark:text-white text-2xl mb-2"}>Account
                        Actions</h1>
                    <div>
                        {data.userId && <DeleteAccountButton userId={data.userId}/>}
                    </div>
                </div>
            </div>
            <div className={"max-w-screen-xl flex-grow mx-auto"}>
                <SettingsTable
                    title={"Stored Options"}
                    description={"A list of all stored options. Be careful when editing them!"}
                    showLastEdited={false}
                    items={data.options.map(option => {
                        return {
                            key: option.key,
                            value: option.raw.substring((option.raw.indexOf(':') + 1)),
                            //lastChanged: option.lastChange
                        }
                    })}
                    revalidateFunction={revalidatePage}
                />
            </div>
        </div>
    )
}

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
        return {
            options: []
        }
    }

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) {
        redirect('/');
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
        options: options,
        userId: cloudSettingsSession.minecraft.uuid
    }
}