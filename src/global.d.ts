import "next-auth"
import "next-auth/jwt"
import type {Role} from "@prisma/client";

type SuccessfulPostLogin = {
    minecraftUserName: string
    minecraftUUID: string
}

type FailedPostLogin = {
    error: string
}

type PostLogin = SuccessfulPostLogin | FailedPostLogin;

type ErrorSession = {
    success: false
    error: string
}

type SuccessSession = {
    success: true
    minecraft: {
        username: string,
        uuid: string
    },
    role: Role;
}

type InternalSession = ErrorSession | SuccessSession;

declare module "next-auth" {
    /**
     * The shape of the account object returned in the OAuth providers' `account` callback,
     * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
     */
    interface Account {
        minecraftUserName: string
        minecraftUUID: string
    }

    /**
     * Returned by `useSession`, `auth`, contains information about the active session.
     */
    interface Session {
        postLogin: InternalSession
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        accessToken: string,
        accessTokenExpiresAt: number
        accessTokenType: string
        userId: string
        error: string | undefined
        postLogin: PostLogin
    }
}