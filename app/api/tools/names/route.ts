import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(_req: NextRequest) {
    const backendRes = await fetch(`${BACKEND_URL}/tools/names`, {
        method: "GET",
        cache: "no-store",
    });

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
}
