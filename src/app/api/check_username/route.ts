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
    });

    if (!user) {
        return NextResponse.json({ status: 'Available' }, { status: 200 });
    }

    return NextResponse.json({
        status: 'Not available'
    }, { status: 400 });
}
