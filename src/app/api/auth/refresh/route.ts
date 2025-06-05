import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, verifyRefreshToken } from '../token';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const cookies = req.cookies;
    const token = cookies.get('refresh_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Refresh token not found.' }, { status: 401 });
    }

    try {
        const payload = verifyRefreshToken(token) as { user_id: string, user_name: string };


        const newAccessToken = generateAccessToken(payload.user_id, payload.user_name);

        const response = NextResponse.json({ message: "Successfully fetched new access token." }, { status: 200 });
        response.cookies.set('access_token', newAccessToken, {
            secure: process.env.RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 // 6 hours in seconds
        });

        return response;
    } catch (err) {
        console.error('[REFRESH_TOKEN_ERROR]', err);
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }
}
