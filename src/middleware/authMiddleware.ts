// src/middleware/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextRequest {
    user: {
        user_id: string;
        user_name: string;
    };
}

export async function authMiddleware(req: NextRequest): Promise<AuthenticatedRequest | NextResponse> {
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
            user_id: string;
            user_name: string;
        };

        const authReq = Object.assign(req, { user: payload });
        return authReq as AuthenticatedRequest;
    } catch {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}