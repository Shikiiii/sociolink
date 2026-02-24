import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const maybeAuthedReq = await authMiddleware(req);
    if (maybeAuthedReq instanceof NextResponse) return maybeAuthedReq;
    // take from maybeAuthedReq.user.user_id, return the website data

    const userId = maybeAuthedReq.user.user_id;

    // Find the user and include their website
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { user_website: true },
    });

    if (!user || !user.user_website) {
        return NextResponse.json({ success: false, error: 'Website not found' }, { status: 404 });
    }

    return NextResponse.json({
        data: {
            avatar: user.user_website.avatar,
            display_name: user.user_website.display_name,
            bio: user.user_website.bio,
            background: user.user_website.background,
            font: user.user_website.font,
            buttonStyle: user.user_website.buttonStyle,
            buttonRoundness: user.user_website.buttonRoundness,
            buttonLayout: user.user_website.buttonLayout,
        }
    }, { status: 200 })
}