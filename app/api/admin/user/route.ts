import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";
import {Role} from "@prisma/client";
import {DeletedUsers, UserEntries} from "@/src/types/ApiTypes";
import {getOrCreatePrisma} from "@/src/db/prisma";

export async function GET() {
    const session = await auth();

    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (!session.postLogin.success) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (session.postLogin.role !== Role.ADMIN) return NextResponse.json({error: "Forbidden"}, {status: 403});

    const prisma = getOrCreatePrisma();
    const users = await prisma.user.findMany({
        include: {
            Option: true,
            LoginToken: true
        },
        orderBy: {
            lastActivity: 'desc'
        }
    });

    const response: UserEntries = {
        users: users.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            jointAt: user.joinedAt,
            lastActivity: user.lastActivity,
            options: user.Option,
            verified: user.verified,
            logins: user.LoginToken.map(token => token.createdAt)
        })),
        date: new Date()
    }

    return NextResponse.json(response);
}

export async function DELETE(req: NextRequest) {
    const session = await auth();

    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (!session.postLogin.success) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (session.postLogin.role !== Role.ADMIN) return NextResponse.json({error: "Forbidden"}, {status: 403});

    const {searchParams} = new URL(req.url);

    const verified = searchParams.get('verified') === '1';
    if (verified) return NextResponse.json({error: "Cannot delete verified users"}, {status: 400});

    const prisma = getOrCreatePrisma();
    const users = await prisma.user.deleteMany({
        where: {
            verified: false
        }
    });

    return NextResponse.json({deleted: users.count} as DeletedUsers);
}

export const runtime = "nodejs";