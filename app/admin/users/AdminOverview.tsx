import {NewUserGraph} from "@/app/admin/users/NewUserGraph";
import {TotalUserGraph} from "@/app/admin/users/TotalUserGraph";
import UserTable from "@/app/admin/users/UserTable";
import {UserData} from "@/app/admin/users/page";

type Props = {
    dataPromise: Promise<{ users: UserData[] }>
    revalidateFunction: VoidFunction
}

export const AdminOverview = async ({dataPromise, revalidateFunction}: Props) => {
    const data = await dataPromise;
    return (
        <>
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
                            0)).length} Active, ${data.users.filter(value => !value.verified).length} Unverified)`}
                        items={data.users}
                        revalidateFunction={revalidateFunction}
                    />
                </div>
            </div>
        </>
    );
};