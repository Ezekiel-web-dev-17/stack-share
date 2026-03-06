import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    const backendRes = await fetch(`${BACKEND_URL}/tools${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: {
            Authorization: req.headers.get("Authorization") || "",
        },
        cache: "no-store",
    });

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
}
