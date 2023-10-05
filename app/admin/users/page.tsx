import type {Option} from "@prisma/client";
import {Prisma, PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth";
import type {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {PredefinedSuspense} from "@/components/global/PredefinedSuspense";
import {AdminOverview} from "@/components/admin/AdminOverview";
import UserGetPayload = Prisma.UserGetPayload;

export default async function Home() {
    async function revalidatePage() {
        "use server";
        revalidatePath('/admin/users');
    }

    const data = getData();
    return (
        <div className={"justify-center grid-cols-1"}>
            <PredefinedSuspense>
                <AdminOverview dataPromise={data} revalidateFunction={revalidatePage}/>
            </PredefinedSuspense>
        </div>
    )
}

export type UserData = {
    id: string
    name: string,
    role: UserGetPayload<{}>['role'],
    jointAt: Date,
    lastActivity: Date,
    options: Option[],
    verified: boolean
    logins: Date[]
}

async function getData(): Promise<{ users: UserData[], date: Date }> {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
        return {
            users: [],
            date: new Date()
        };
    }

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) {
        redirect('/');
        return {
            users: [],
            date: new Date()
        }
    }

    if (cloudSettingsSession.role !== "ADMIN") {
        redirect('/');
        return {
            users: [],
            date: new Date()
        }
    }

    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
        include: {
            Option: true,
            LoginToken: true
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
            options: user.Option,
            verified: user.verified,
            logins: user.LoginToken.map(token => token.createdAt)
        })),
        date: new Date()
    }
}

export const revalidate = 500;
export const dynamic = "force-dynamic";