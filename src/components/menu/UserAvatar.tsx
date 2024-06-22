"use client"
import {Avatar} from "antd";
import {Session} from "next-auth";

type Props = {
    user?: Session | null
}
export const UserAvatar = ({user}: Props) => {
    if (user?.postLogin.success) {
        return (
            <Avatar src={`https://mc-heads.net/avatar/${user.postLogin.minecraft.uuid}`}/>
        )
    }
    return (
        <Avatar/>
    );
};