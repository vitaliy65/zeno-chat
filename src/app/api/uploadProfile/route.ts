import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
    try {
        // For multipart/form-data use formData()
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const userId = formData.get("userId") as string | null;

        if (!file || !userId) {
            return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
        }

        // Upload the file to Vercel Blob Storage
        const { url } = await put(
            `user_avatars/avatar_${userId}.webp`,
            file,
            { access: "public", allowOverwrite: true, addRandomSuffix: true }
        );

        return NextResponse.json({ url });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
        }
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}