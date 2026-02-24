import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, Provider } from '@/generated/prisma/client';
import { generateAccessToken, generateRefreshToken } from '@/app/api/auth/token';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const {
    ACCESS_TOKEN_SECRET,
    RUNNING_IN,
} = process.env;

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

interface DecodedToken {
    provider: string;
    external_id: string;
    email: string;
    name: string;
    picture?: string;
}

async function uploadToImgBB__link(imageUrl: string): Promise<string> {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

    const formData = new FormData();

    if (!IMGBB_API_KEY) return "";

    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);

    try {
        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { token, password } = body;

    try {
        if (!token) {
            return NextResponse.json({ message: 'Missing token.' }, { status: 400 });
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as DecodedToken;

        const { provider, external_id, email } = decoded;
        let { name, picture } = decoded;

        // Username validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(name)) {
            name = `user_${Math.random().toString(36).substring(2, 15)}`;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Error during OAuth validation: Invalid email format.' }, { status: 400 });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                message: 'Error during OAuth validation: Password must be at least 8 characters long, less than 100, and contain at least one letter and one number.'
            }, { status: 400 });
        }

        // Hash password
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        if (!hashedPassword) {
            return NextResponse.json({
                message: 'Error during OAuth validation: Password is null.'
            }, { status: 400 });
        }

        // Create user
        const newUser = await prisma.user.create({
            data: {
                user_id: crypto.randomUUID(),
                user_email: email,
                user_name: name,
                user_password: hashedPassword,
                oauth_provider: provider,
            },
        });

        // Create OAuth record
        await prisma.oAuth.create({
            data: {
                provider: provider as Provider,
                user_id: newUser.user_id,
                external_id,
                email,
            },
        });

        // Use the uploadToImgBB function to upload the user's avatar (it takes a File as an argument)
        // it returns a URL. Replace picture with the returned URL
        if (picture) {
            try {
                const uploadedPictureUrl = await uploadToImgBB__link(picture);
                picture = uploadedPictureUrl;
            } catch (uploadError) {
                console.error('[IMAGE UPLOAD ERROR]', uploadError);
                NextResponse.json({ message: 'Error uploading profile picture.' }, { status: 500 });
                return;
            }
        }

        // ALSO create website for user with example values
        await prisma.website.create({
            data: {
                avatar: null,
                display_name: name,
                bio: '',
                background: null,
                user: {
                    connect: { user_id: newUser.user_id }
                }
            }
        });

        // Generate tokens
        const refreshToken = generateRefreshToken(newUser.user_id, newUser.user_name);
        const accessToken = generateAccessToken(newUser.user_id, newUser.user_name);

        const res = NextResponse.json({
            user: {
                user_id: newUser.user_id,
                user_name: newUser.user_name,
            },
            message: 'User registered successfully.'
        }, { status: 201 });

        res.cookies.set('refresh_token', refreshToken, {
            secure: RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // seconds
            path: '/',
        });
        res.cookies.set('access_token', accessToken, {
            secure: RUNNING_IN === 'production',
            sameSite: 'strict',
            maxAge: 6 * 60 * 60, // seconds
            path: '/',
        });

        return res;
    } catch (err) {
        console.error('[OAUTH FINISH ERROR]', err);
        NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }
}
