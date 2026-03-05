import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: NextRequest) {
    const backendRes = await fetch(`${BACKEND_URL}/tools`, {
        method: "GET",
        headers: {
            Authorization: req.headers.get("Authorization") || "",
        },
        // Adding cache: 'force-cache' to upstream fetch just like frontend had it
        cache: "force-cache",
    });

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
}
