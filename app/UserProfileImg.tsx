import {UserCircleIcon} from "@heroicons/react/24/outline";
import {CloudSettingsSession} from "@/src/types/AuthTypes";

type Props = {
    session: CloudSettingsSession | null,
    className?: string
}

export const UserProfileImg = ({session, className}: Props) => {
    if (!session) {
        return <></>;
    }

    if (!session.postLogin) {
        return <UserCircleIcon className={className}/>
    }

    return (
        <img className={className} src={`https://mc-heads.net/avatar/${session.minecraft.uuid}`} alt=""
             key={"profile img"}/>
    );
};