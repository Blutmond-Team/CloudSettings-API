import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth";
import type {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UserTable from "@/app/admin/users/UserTable";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {NewUserGraph} from "@/app/admin/users/NewUserGraph";
import {TotalUserGraph} from "@/app/admin/users/TotalUserGraph";
import type {Option} from ".prisma/client";
import {Prisma} from ".prisma/client";
import UserGetPayload = Prisma.UserGetPayload;

export default async function Home() {
    async function revalidatePage() {
        "use server";
        revalidatePath('/admin/users');
    }

    const data = await getData();
    return (
        <div className={"justify-center grid-cols-1"}>
            <div className={"flex justify-center"}>
                <div className={"max-w-screen-xl flex-grow flex justify-around"}>
                    <NewUserGraph data={data.users}/>
                    <TotalUserGraph data={data.users}/>
                </div>
            </div>
            <div className={"flex justify-center"}>
                <div className={"max-w-screen-xl flex-grow"}>
                    <UserTable
                        title={"User Data"}
                        description={`${data.users.length ?? 0} Total Users (${data.users.filter(value => new Date(value.lastActivity).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0,
                            0)).length} Active)`}
                        items={data.users}
                        revalidateFunction={revalidatePage}
                    />
                </div>
            </div>
        </div>
    )
}

export type UserData = {
    id: string
    name: string,
    role: UserGetPayload<{}>['role'],
    jointAt: Date,
    lastActivity: Date,
    options: Option[]
}

async function getData(): Promise<{ users: UserData[] }> {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
        return {
            users: []
        }
    }

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) {
        redirect('/');
        return {
            users: []
        }
    }

    if (cloudSettingsSession.role !== "ADMIN") {
        redirect('/');
        return {
            users: []
        }
    }

    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
        include: {
            Option: true
        },
        orderBy: {
            lastActivity: 'desc'
        }
    });


    return {
        users: users.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            jointAt: user.joinedAt,
            lastActivity: user.lastActivity,
            options: user.Option
        }))
    }
}

export const revalidate = 500;