import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const backendUrl = `${BACKEND_URL}/workflows${searchParams.toString() ? `?${searchParams.toString()}` : ""
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

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
            { message: "Authentication required" },
            { status: 401 }
        );
    }

    // Forward the raw body (multipart/form-data) straight to the backend
    const formData = await req.formData();

    const backendRes = await fetch(`${BACKEND_URL}/workflows`, {
        method: "POST",
        headers: {
            Authorization: authHeader,
        },
        body: formData as unknown as BodyInit,
    });

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json(data, { status: backendRes.status });
}
