"use server"
import {getServerSession} from "next-auth";
import type {CloudSettingsSession} from "@/src/types/AuthTypes";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {PrismaClient} from "@prisma/client";

export async function blacklistUserOption(optionKey: string) {
    const session = await getServerSession(authOptions);
    if (!session) return;

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) return;

    const prisma = new PrismaClient();
    await prisma.option.update({
        data: {
            blacklisted: true
        },
        where: {
            userId_key: {
                userId: cloudSettingsSession.minecraft.uuid,
                key: optionKey
            }
        }
    })
    await prisma.$disconnect();
}

export async function whitelistUserOption(optionKey: string) {
    const session = await getServerSession(authOptions);
    if (!session) return;

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) return;

    const prisma = new PrismaClient();
    await prisma.option.update({
        data: {
            blacklisted: false
        },
        where: {
            userId_key: {
                userId: cloudSettingsSession.minecraft.uuid,
                key: optionKey
            }
        }
    })
    await prisma.$disconnect();
}