import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client'; // Adjust import based on your setup

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { user_name: username },
        include: {
            user_website: {
                include: {
                    socials: true,
                },
            },
        },
    });

    if (!user || !user.user_website) {
        return NextResponse.json({ error: 'User or website not found' }, { status: 404 });
    }

    return NextResponse.json({
        website: user.user_website,
        socials: user.user_website.socials,
    });
}
