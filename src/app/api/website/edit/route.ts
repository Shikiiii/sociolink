import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
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
    const nameRegex = /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~ ]+$/;
    if (display_name && (display_name.length < 3 || display_name.length > 60 || !nameRegex.test(display_name))) {
        return 'Invalid display_name';
    }
    if (bio && (bio.length < 3 || bio.length > 300 || !nameRegex.test(bio))) {
        return 'Invalid bio';
    }
    return null;
}

export async function POST(req: NextRequest) {
    const maybeAuthedReq = await authMiddleware(req);
    if (maybeAuthedReq instanceof NextResponse) return maybeAuthedReq;

    const formData = await req.formData();
    const display_name = formData.get('display_name')?.toString();
    const bio = formData.get('bio')?.toString();
    const backgroundInput = formData.get('background');
    const blur = formData.get('blur')?.toString();
    const avatar = formData.get('avatar') as File | null;
    const font = formData.get('font')?.toString();
    const buttonStyle = formData.get('buttonStyle')?.toString();
    const buttonRoundness = formData.get('buttonRoundness')?.toString();
    const buttonLayout = formData.get('buttonLayout')?.toString();

    const validationError = validateInput(display_name, bio);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let backgroundUrl: string | undefined;
    if (backgroundInput instanceof File && backgroundInput.size > 0) {
        try {
            const url = await uploadToImgBB(backgroundInput);
            backgroundUrl = `${url}|${blur || '0'}`;
        } catch {
            return NextResponse.json({ error: 'Failed to upload background' }, { status: 500 });
        }
    } else if (typeof backgroundInput === 'string') {
        backgroundUrl = backgroundInput;
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

    interface WebsiteUpdateData {
        display_name?: string;
        bio?: string;
        background?: string;
        avatar?: string;
        font?: string;
        buttonStyle?: string;
        buttonRoundness?: string;
        buttonLayout?: string;
    }

    const updateData: WebsiteUpdateData = { display_name, bio };
    if (backgroundUrl !== undefined) {
        updateData.background = backgroundUrl;
    }
    if (avatarUrl !== undefined) {
        updateData.avatar = avatarUrl;
    }
    if (font !== undefined) {
        updateData.font = font;
    }
    if (buttonStyle !== undefined) {
        updateData.buttonStyle = buttonStyle;
    }
    if (buttonRoundness !== undefined) {
        updateData.buttonRoundness = buttonRoundness;
    }
    if (buttonLayout !== undefined) {
        updateData.buttonLayout = buttonLayout;
    }
    await prisma.website.update({
        where: { id: user.user_website_id },
        data: updateData
    });

    return NextResponse.json({ success: true, avatar: avatarUrl, background: backgroundUrl });
}