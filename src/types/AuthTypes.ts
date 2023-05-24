import {JWT} from "next-auth/jwt";
import {Session} from "next-auth";

type SuccessfulPostLogin = {
    xboxToken: string
    xboxUserHash: string
    minecraftServicesToken: string
    minecraftServicesUserHash: string
    minecraftAccessToken: string
    minecraftUserName: string
    minecraftUUID: string
}

type FailedPostLogin = {
    error: string
}

type PostLogin = SuccessfulPostLogin | FailedPostLogin;

export type CloudSettingsToken = {
    accessToken: string,
    accessTokenExpiresAt: number
    accessTokenType: string
    userId: string
    error: string | undefined
} & JWT & PostLogin;

export type MsStoreItem = {
    name: string,
    signature: string
}

type ErrorSession = {
    error: string
}

type SuccessSession = {
    minecraft: {
        username: string,
        uuid: string
    }
}

type InternalSession = ErrorSession | SuccessSession;

export type CloudSettingsSession = InternalSession & Session;