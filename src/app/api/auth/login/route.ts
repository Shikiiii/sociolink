import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '@/app/api/auth/token'; // adjust path

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { user_email: email } });

        if (!user || !user.user_password) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (!passwordMatch) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        const accessToken = generateAccessToken(user.user_id, user.user_name);
        const refreshToken = generateRefreshToken(user.user_id, user.user_name);

        const response = NextResponse.json({
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
            }
        });

        response.cookies.set('access_token', accessToken, {
            secure: process.env.RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 6 * 60 * 60, // 6 hours in seconds
        });

        response.cookies.set('refresh_token', refreshToken, {
            secure: process.env.RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        });

        return response;
    } catch (err) {
        console.error('[LOGIN_ERROR]', err);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
