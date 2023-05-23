import {DefaultSession} from "next-auth";
import {UserCircleIcon} from "@heroicons/react/24/outline";

type Props = {
    user: DefaultSession['user'],
    className?: string
}

export const UserProfileImg = ({user, className}: Props) => {
    if (!user) {
        return <></>;
    }

    if (!user.image) {
        return <UserCircleIcon className={className}/>
    }

    return (
        <img className="h-8 w-8 rounded-full" src={user.image} alt="" key={"profile img"}/>
    );
};