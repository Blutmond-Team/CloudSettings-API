import {NextResponse} from 'next/server';
import {PrismaClient} from "@prisma/client";
import * as console from "node:console";

export async function GET() {
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1;`;
        return NextResponse.json({
            status: "ok",
            time: Date.now()
        });
    } catch (ex) {
        console.error(ex);
        return new Response("Internal Server Error", {
            status: 500,
            statusText: "Internal Server Error"
        });
    }
}
