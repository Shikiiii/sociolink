import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, AuthenticatedRequest } from '@/middleware/authMiddleware';
import axios from 'axios';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const maybeAuthedReq = await authMiddleware(req as any);
    if (maybeAuthedReq instanceof NextResponse) return maybeAuthedReq;
    // take from maybeAuthedReq.user.user_id, return the website data

    const userId = maybeAuthedReq.user.user_id;

    // Parse and validate input
    const body = await req.json();
    const { type, link, text } = body;

    // Validate type
    if (typeof type !== 'string' || !type.trim()) {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Validate link
    if (typeof link !== 'string' || !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(link)) {
        return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
    }

    // Validate text
    if (typeof text !== 'string' || text.length < 3 || text.length > 60) {
        return NextResponse.json({ error: 'Text must be between 3 and 60 characters' }, { status: 400 });
    }

    // Find the user's website
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { user_website: true }
    });

    if (!user || !user.user_website) {
        return NextResponse.json({ error: 'User website not found' }, { status: 404 });
    }

    // Create the new social
    const social = await prisma.social.create({
        data: {
            type,
            link,
            text,
            websiteId: user.user_website.id
        }
    });

    return NextResponse.json(social, { status: 201 });

}