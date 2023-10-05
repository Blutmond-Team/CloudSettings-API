"use client"
import type {CloudSettingsSession} from "@/src/types/AuthTypes";
import {Avatar} from "antd";

type Props = {
    user?: CloudSettingsSession
}
export const UserAvatar = ({user}: Props) => {
    if (user?.postLogin) {
        return (
            <Avatar src={`https://mc-heads.net/avatar/${user.minecraft.uuid}`}/>
        )
    }
    return (
        <Avatar/>
    );
};