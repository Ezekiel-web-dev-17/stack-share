import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const backendUrl = `${BACKEND_URL}/workflows/search${searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;

    const backendRes = await fetch(backendUrl, {
        method: "GET",
        headers: {
            Authorization: req.headers.get("Authorization") || "",
        },
    });

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
}
