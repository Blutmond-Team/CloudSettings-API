import NextAuth, {NextAuthOptions} from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
import {CloudSettingsToken} from "@/src/types/AuthTypes";
import {loginIntoMinecraft} from "@/src/utils/MicrosoftLoginUtils";
import {PrismaClient} from "@prisma/client";

export const authOptions: NextAuthOptions = {
    providers: [
        AzureAD({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            authorization: {
                params: {
                    scope: "openid profile email XboxLive.signin"
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({token, user, account, profile}) => {
            // On sign in
            if (account) {
                // Ensure I don't mess up which other login methods
                if (account.provider === "azure-ad") {
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

            return {
                ...session,
                minecraft: {
                    username: t.minecraftUserName,
                    uuid: t.minecraftUUID
                },
                postLogin: true
            };
        }
    }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
export const dynamic = "force-dynamic";