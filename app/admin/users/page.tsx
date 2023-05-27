import {PrismaClient, Prisma} from "@prisma/client";
import {getServerSession} from "next-auth";
import {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UserTable from "@/app/admin/users/UserTable";

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
    name: string,
    role: Prisma.UserGetPayload<{}>['role'],
    jointAt: Date,
    lastActivity: Date,
    options: number
}

async function getData(): Promise<{ users: UserData[] }> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return {
            users: []
        }
    }

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) {
        return {
            users: []
        }
    }

    if (cloudSettingsSession.role !== "ADMIN") {
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
            name: user.name,
            role: user.role,
            jointAt: user.joinedAt,
            lastActivity: user.lastActivity,
            options: user.Option.length
        }))
    }
}

export const revalidate = 500;