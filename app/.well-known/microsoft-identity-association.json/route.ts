import {NextResponse} from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({
        "associatedApplications": [
            {
                "applicationId": "79bb8b12-5f76-41f9-b0df-2489df28cf94"
            }
        ]
    });
}