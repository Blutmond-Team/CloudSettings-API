"use server"
import type {CloudSettingsSession} from "@/src/types/AuthTypes";
import {PrismaClient} from "@prisma/client";
import {auth} from "@/auth";

export async function blacklistUserOption(optionKey: string) {
    const session = await auth();
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
    const session = await auth();
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

export async function deleteUserOption(optionKey: string) {
    const session = await auth();
    if (!session) return;

    const cloudSettingsSession = session as CloudSettingsSession;
    if (!cloudSettingsSession.postLogin) return;

    const prisma = new PrismaClient();
    await prisma.option.delete({
        where: {
            userId_key: {
                userId: cloudSettingsSession.minecraft.uuid,
                key: optionKey
            }
        }
    });

    await prisma.$disconnect();
}
