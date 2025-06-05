import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import qs from 'querystring';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/generated/prisma/client';
import axios from 'axios';
import { generateAccessToken, generateRefreshToken } from '@/app/api/auth/token';

const prisma = new PrismaClient();

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    ACCESS_TOKEN_SECRET,
    RUNNING_IN
} = process.env;

// GET /api/oauth/google
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let state = 'google';

    if (searchParams.has('state')) {
        state = searchParams.get('state') as string;
    }

    const redirectUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + qs.stringify({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: state,
    });

    return NextResponse.redirect(redirectUrl);
}

// GET /api/oauth/google/callback
export async function GETCallback(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const rawState = searchParams.get('state');

    let stateData: { from?: string; link_account?: string } = {};
    if (rawState) {
        try {
            stateData = JSON.parse(decodeURIComponent(rawState));
        } catch (e) {
            console.error('Failed to parse state:', e);
        }
    }

    if (!code) {
        return NextResponse.redirect(`/auth/error?message=missing-code`);
    }

    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { id, email, name, avatar } = userRes.data;
        if (!email) {
            return NextResponse.redirect(`/auth/error?message=email-not-available`);
        }

        const existingOAuth = await prisma.oAuth.findUnique({
            where: { external_id: id },
            include: { user: true },
        });

        if (existingOAuth && stateData.link_account) {
            const user = await prisma.user.findUnique({
                where: { user_email: stateData.link_account },
            });

            if (!user) {
                return NextResponse.redirect(`/auth/error?message=oauth-failed`);
            }

            await prisma.oAuth.create({
                data: {
                    provider: 'google',
                    user_id: user.user_id,
                    external_id: id,
                    email,
                },
            });

            await prisma.user.update({
                where: { user_id: user.user_id },
                data: { oauth_provider: 'discord' },
            });

            return NextResponse.redirect(`/auth/success?message=account-linked`);
        }

        if (existingOAuth) {
            const accessToken = generateAccessToken(existingOAuth.user_id, existingOAuth.user.user_name);
            const refreshToken = generateRefreshToken(existingOAuth.user_id, existingOAuth.user.user_name);

            const res = NextResponse.redirect(`/auth/success?message=login-success`);

            res.cookies.set('access_token', accessToken, {
                secure: RUNNING_IN === 'production',
                sameSite: 'strict',
                maxAge: 6 * 60 * 60,
            });

            res.cookies.set('refresh_token', refreshToken, {
                secure: RUNNING_IN === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60,
            });

            return res;
        }

        const emailTaken = await prisma.user.findUnique({
            where: { user_email: email },
        });

        if (emailTaken) {
            return NextResponse.redirect(`/auth/error?message=email-taken`);
        }

        const tempToken = jwt.sign(
            {
                provider: 'google',
                external_id: id,
                email,
                name: name,
                picture: avatar || null,
            },
            ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' }
        );

        return NextResponse.redirect(`/auth/oauth-register?token=${tempToken}&provider=discord`);
    } catch (e) {
        console.error('[DISCORD OAUTH ERROR]', e);
        return NextResponse.redirect(`/auth/error?message=oauth-failed`);
    }
}