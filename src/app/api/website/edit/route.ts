import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';
import axios from 'axios';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

const API_KEY = process.env.IMGBB_API_KEY;

async function uploadToImgBB(file: Blob): Promise<string> {
    const formData = new FormData();

    if (!API_KEY) return "";

    formData.append('key', API_KEY);
    formData.append('image', file);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data && response.data.success) {
        return response.data.data.url;
    }
    throw new Error('Failed to upload image');
}

function validateInput(display_name?: string, bio?: string): string | null {
    const nameRegex = /^[A-Za-z0-9 ]+$/;
    if (display_name && (display_name.length < 3 || display_name.length > 60 || !nameRegex.test(display_name))) {
        return 'Invalid display_name';
    }
    if (bio && (bio.length < 3 || bio.length > 300 || !nameRegex.test(bio))) {
        return 'Invalid bio';
    }
    return null;
}

export async function POST(req: NextRequest) {
    const maybeAuthedReq = await authMiddleware(req as any);
    if (maybeAuthedReq instanceof NextResponse) return maybeAuthedReq;

    const formData = await req.formData();
    const display_name = formData.get('display_name')?.toString();
    const bio = formData.get('bio')?.toString();
    const background = formData.get('background')?.toString();
    const avatar = formData.get('avatar') as File | null;

    const validationError = validateInput(display_name, bio);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let avatarUrl: string | undefined;
    if (avatar && avatar.size > 0) {
        try {
            avatarUrl = await uploadToImgBB(avatar);
        } catch {
            return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
        }
    }

    const user = await prisma.user.findUnique({
        where: { user_id: maybeAuthedReq.user.user_id },
        select: { user_website_id: true }
    });

    if (!user || !user.user_website_id) {
        return NextResponse.json({ error: 'Website not found for user' }, { status: 404 });
    }

    const updateData: any = { display_name, bio, background };
    if (avatarUrl !== undefined) {
        updateData.avatar = avatarUrl;
    }
    await prisma.website.update({
        where: { id: user.user_website_id },
        data: updateData
    });

    return NextResponse.json({ success: true, avatar: avatarUrl });
}