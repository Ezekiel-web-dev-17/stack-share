import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
            { message: "Authentication required" },
            { status: 401 }
        );
    }

    const backendRes = await fetch(`${BACKEND_URL}/workflows/${id}/like`, {
        method: "POST",
        headers: {
            Authorization: authHeader,
        }
    });

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
}
