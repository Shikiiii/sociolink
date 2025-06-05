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

    // Find the user and include their website's socials
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: {
            user_website: {
                include: {
                    socials: true
                }
            }
        }
    });

    if (!user || !user.user_website) {
        return NextResponse.json({ error: 'Website or socials not found' }, { status: 404 });
    }

    const socials = user.user_website.socials;

    return NextResponse.json(socials, { status: 200 });

}