import { NextRequest, NextResponse } from 'next/server';
import qs from 'querystring';

const {
    DISCORD_CLIENT_ID,
    DISCORD_REDIRECT_URI,
} = process.env;

// GET /api/oauth/discord
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let state = 'discord';

    if (searchParams.has('state')) {
        state = searchParams.get('state') as string;
    }

    const discordUrl =
        'https://discord.com/api/oauth2/authorize?' +
        qs.stringify({
            client_id: DISCORD_CLIENT_ID,
            redirect_uri: DISCORD_REDIRECT_URI,
            response_type: 'code',
            scope: 'identify email',
            prompt: 'consent',
            state: state,
        });

    return NextResponse.redirect(discordUrl);
}