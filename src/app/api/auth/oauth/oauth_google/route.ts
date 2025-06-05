import { NextRequest, NextResponse } from 'next/server';
import qs from 'querystring';

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
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