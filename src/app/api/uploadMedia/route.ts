import { put, PutBlobResult } from '@vercel/blob';

export type PutFileResponse = PutBlobResult & { filename: string };

export async function PUT(request: Request) {
    const form = await request.formData();
    const file = form.get('file') as File;
    const userId = form.get('userId') as string | null;
    const chatId = form.get('chatId') as string | null;

    if (!file || !userId || !chatId) {
        return new Response(JSON.stringify({ message: "Missing file, userId or chatId" }), { status: 400 });
    }

    // Save to path: userId/chatId/filename
    const filePath = `usersMedia/${chatId}/${userId}/${file.name}`;

    const blob = await put(filePath, file, {
        access: 'public',
        addRandomSuffix: true,
    });

    // Return blob info, file name, and type
    return Response.json({
        ...blob,
        filename: file.name,
    });
}