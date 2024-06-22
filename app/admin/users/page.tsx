import {Option, Role} from "@prisma/client";
import {AdminOverview} from "@/components/admin/AdminOverview";
import {deleteUnverifiedUsers} from "@/app/actions";

export default async function Home() {
    return (
        <div className={"justify-center grid-cols-1"}>
                <AdminOverview
                    deleteUnverifiedFunction={deleteUnverifiedUsers}
                />
        </div>
    )
}

export type UserData = {
    id: string
    name: string,
    role: Role,
    jointAt: Date,
    lastActivity: Date,
    options: Option[],
    verified: boolean
    logins: Date[]
}

export const revalidate = 500;
export const dynamic = "force-dynamic";
