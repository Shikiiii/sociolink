import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const maybeAuthedReq = await authMiddleware(req as any);
    if (maybeAuthedReq instanceof NextResponse) return maybeAuthedReq;

    const userId = maybeAuthedReq.user.user_id;

    // Parse and validate input
    const body = await req.json();
    const { type, link, text, order } = body;

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

    // Validate order
    if (typeof order !== 'number') {
        return NextResponse.json({ error: 'Order must be a number.' }, { status: 400 });
    }


    // Find the user's website
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { user_website: true }
    });

    if (!user || !user.user_website) {
        return NextResponse.json({ error: 'User website not found' }, { status: 404 });
    }

    // Find the existing social
    const existingSocial = await prisma.social.findFirst({
        where: {
            type,
            link,
            text,
            order,
            websiteId: user.user_website.id
        }
    });

    if (!existingSocial) {
        return NextResponse.json({ error: 'Social not found' }, { status: 404 });
    }

    // Remove the social
    await prisma.social.delete({
        where: { id: existingSocial.id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
}