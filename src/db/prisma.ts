import {PrismaClient} from '@prisma/client'

let prisma: PrismaClient;

export const getOrCreatePrisma = () => {
    if (prisma) return prisma;


};

