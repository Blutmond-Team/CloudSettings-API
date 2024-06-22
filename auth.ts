import NextAuth from "next-auth"
import {CloudSettingsToken} from "@/src/types/AuthTypes";
import {loginIntoMinecraft} from "@/src/utils/MicrosoftLoginUtils";
import {Role} from "@prisma/client";
import Entra from "next-auth/providers/microsoft-entra-id"
import {getOrCreatePrisma} from "@/src/db/prisma";
import _ from "lodash";

const MinecraftLogin = Entra({
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID,
    authorization: {
        params: {
            scope: "openid profile email XboxLive.signin offline_access"
        }
    }
});

export const {auth, handlers, signIn, signOut} = NextAuth({
    providers: [MinecraftLogin],
    debug: process.env.NODE_ENV !== "production",
    callbacks: {
        signIn: async ({account}) => {
            if (!account) return false;
            if (account.provider !== "microsoft-entra-id") return false;
            try {
                const fakeToken = {accessToken: account.access_token} as CloudSettingsToken;
                await loginIntoMinecraft(fakeToken);

                if (fakeToken.postLogin && !("error" in fakeToken.postLogin)) {
                    account.minecraftUUID = fakeToken.postLogin.minecraftUUID;
                    account.minecraftUserName = fakeToken.postLogin.minecraftUserName;

                    const prisma = getOrCreatePrisma();
                    await prisma.user.upsert({
                        create: {
                            id: account.minecraftUUID as string,
                            name: account.minecraftUserName as string
                        },
                        update: {
                            name: account.minecraftUserName as string
                        },
                        where: {
                            id: account.minecraftUUID as string
                        }
                    });
                    return true;
                }
            } catch (error) {
                console.error(error)
            }
            return false;
        },
        jwt: async ({token, user, account}) => {
            if (account) {
                // Add required data to next auth jwt
                token.accessToken = account.token_type!;
                token.accessToken = account.access_token!;
                token.accessTokenExpiresAt = account.expires_at! * 1000;
                token.userId = user.id!;

                token.postLogin = {
                    minecraftUserName: account.minecraftUserNAme,
                    minecraftUUID: account.minecraftUUID,
                }
            }

            return token;
        },
        session: async ({session, token}) => {
            const newSession = _.cloneDeep(session);

            if ("error" in token.postLogin) {
                newSession.postLogin = {
                    success: false,
                    error: token.postLogin.error
                }
            } else {
                const prisma = getOrCreatePrisma();
                const userRole = await prisma.user.findFirst({
                    where: {
                        id: token.minecraftUUID!
                    }
                });

                newSession.postLogin = {
                    success: true,
                    minecraft: {
                        username: token.postLogin.minecraftUserName,
                        uuid: token.postLogin.minecraftUUID
                    },
                    role: userRole?.role ?? "USER"
                }
            }

            return newSession;
        },
    }
});

export const moderatingRoles: Role[] = [Role.MODERATOR, Role.ADMIN];
