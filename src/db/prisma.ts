import {PrismaClient} from '@prisma/client'

let prisma: PrismaClient;

export const getOrCreatePrisma = () => prisma ?? new PrismaClient();

