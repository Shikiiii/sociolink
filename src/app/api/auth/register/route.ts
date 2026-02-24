import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@/generated/prisma/client';
import { generateAccessToken, generateRefreshToken } from '@/app/api/auth/token';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, username } = body;

        // Basic validation
        if (!email || !password || !username) {
            return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
        }

        // Verify username
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json({ message: 'Invalid username format.' }, { status: 400 });
        }

        // Verify email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
        }

        // Verify password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                message: 'Password must be at least 8 characters long, less than 100, and contain at least one letter and one number.'
            }, { status: 400 });
        }

        // Check if email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ user_email: email }, { user_name: username }]
            }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Email or username already taken.' }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user
        const userId = crypto.randomUUID();

        await prisma.user.create({
            data: {
                user_id: userId,
                user_email: email,
                user_name: username,
                user_password: hashedPassword,
            }
        });

        // ALSO create website for user with example values
        const website = await prisma.website.create({
            data: {
                avatar: null,
                display_name: username,
                bio: '',
                background: null,
                user: {
                    connect: { user_id: userId }
                }
            }
        });

        // Update user with website id
        await prisma.user.update({
            where: { user_id: userId },
            data: { user_website_id: website.id }
        });

        const accessToken = generateAccessToken(userId, username);
        const refreshToken = generateRefreshToken(userId, username);

        const response = NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });

        response.cookies.set('refresh_token', refreshToken, {
            secure: process.env.RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
        });

        response.cookies.set('access_token', accessToken, {
            secure: process.env.RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 6 * 60 * 60 // 6 hours in seconds
        });

        return response;
    } catch (err) {
        console.error('[REGISTER_ERROR]', err);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
