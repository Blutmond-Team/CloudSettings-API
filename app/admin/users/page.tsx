import {PrismaClient, Prisma, Option} from "@prisma/client";
import {getServerSession} from "next-auth";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UserTable from "@/app/admin/users/UserTable";
import {redirect} from "next/navigation";

export default async function Home() {
    const data = await getData();
    return (
        <div className={"flex justify-center"}>
            <div className={"max-w-screen-xl flex-grow"}>
                <UserTable
                    title={"User Data"}
                    items={data.users}
                />
            </div>
        </div>
    )
}

export type UserData = {
    id: string
    name: string,
    role: Prisma.UserGetPayload<{}>['role'],
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