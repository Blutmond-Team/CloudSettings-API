import NextAuth from "next-auth"
import {type CloudSettingsSession, CloudSettingsToken} from "@/src/types/AuthTypes";
import {loginIntoMinecraft} from "@/src/utils/MicrosoftLoginUtils";
import {PrismaClient} from "@prisma/client";
import Entra from "next-auth/providers/microsoft-entra-id"

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
            try {
                const fakeToken = {accessToken: account.access_token} as CloudSettingsToken;
                await loginIntoMinecraft(fakeToken);
                return !("error" in fakeToken);
            } catch (error) {
                console.error(error)
                return false;
            }
        },
        jwt: async ({token, user, account, profile}) => {
            // On sign in
            if (account) {
                // Ensure I don't mess up which other login methods
                if (account.provider === "microsoft-entra-id" && user.id) {
                    let t: CloudSettingsToken = token as CloudSettingsToken;
                    // Add required data to next auth jwt
                    t.accessToken = account.token_type!;
                    t.accessToken = account.access_token!;
                    t.accessTokenExpiresAt = account.expires_at! * 1000;
                    t.userId = user.id;
                    await loginIntoMinecraft(t);
                    // Add / update user data when user is successfully logged in
                    if (!Object.hasOwn(t, 'error')) {
                        const prisma = new PrismaClient();
                        await prisma.user.upsert({
                            create: {
                                id: t.minecraftUUID as string,
                                name: t.minecraftUserName as string
                            },
                            update: {
                                name: t.minecraftUserName as string
                            },
                            where: {
                                id: t.minecraftUUID as string
                            }
                        });
                    }
                }
            }
            return token;
        },
        session: async ({session, token}) => {
            const t: CloudSettingsToken = token as CloudSettingsToken;

            if (Object.hasOwn(t, 'error')) {
                return {
                    ...session,
                    error: t.error,
                    postLogin: false
                }
            }

            const client = new PrismaClient();
            const userRole = await client.user.findFirst({
                where: {
                    id: t.minecraftUUID!
                }
            });

            await client.$disconnect();

            return {
                ...session,
                minecraft: {
                    username: t.minecraftUserName,
                    uuid: t.minecraftUUID
                },
                postLogin: true,
                role: userRole?.role ?? "USER"
            } as CloudSettingsSession;
        }
    }
});

export const runtime = 'nodejs';
