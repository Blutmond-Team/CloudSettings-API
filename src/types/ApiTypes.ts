import {Option, Role} from "@prisma/client";

export type UsageStats = {
    userCount: number;
    optionsCount: number;
    totalDownloads: number;
}

export type UserEntries = {
    users: {
        id: string
        name: string,
        role: Role,
        jointAt: Date,
        lastActivity: Date,
        options: Option[],
        verified: boolean
        logins: Date[]
    }[],
    date: Date
}

export type DeletedUsers = {
    deleted: number
}