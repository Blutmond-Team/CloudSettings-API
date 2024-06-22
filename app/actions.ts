"use server"
import {auth, moderatingRoles} from "@/auth";
import {getOrCreatePrisma} from "@/src/db/prisma";


export async function blacklistUserOption(optionKey: string) {
    const session = await auth();

    if (!session) return;
    if (!session.postLogin.success) return;
    const prisma = getOrCreatePrisma();

    await prisma.option.update({
        data: {
            blacklisted: true
        },
        where: {
            userId_key: {
                userId: session.postLogin.minecraft.uuid,
                key: optionKey
            }
        }
    })
}

export async function whitelistUserOption(optionKey: string) {
    const session = await auth();

    if (!session) return;
    if (!session.postLogin.success) return;

    const prisma = getOrCreatePrisma();

    await prisma.option.update({
        data: {
            blacklisted: false
        },
        where: {
            userId_key: {
                userId: session.postLogin.minecraft.uuid,
                key: optionKey
            }
        }
    })
}

export async function deleteUserOption(optionKey: string) {
    const session = await auth();

    if (!session) return;
    if (!session.postLogin.success) return;

    const prisma = getOrCreatePrisma();

    await prisma.option.delete({
        where: {
            userId_key: {
                userId: session.postLogin.minecraft.uuid,
                key: optionKey
            }
        }
    });
}

export async function deleteUnverifiedUsers() {
    "use server"
    const session = await auth();

    if (!session) return;
    if (!session.postLogin.success) return;
    if (!moderatingRoles.includes(session.postLogin.role)) return;

    const prisma = getOrCreatePrisma();

    const result = await prisma.user.deleteMany({
        where: {
            verified: false
        }
    });

    console.log("Deleted " + result.count + " unverified users.");
}