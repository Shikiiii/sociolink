import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(user_id: string, user_name: string) {
    return jwt.sign({ user_id, user_name }, JWT_ACCESS_SECRET, { expiresIn: '6h' });
}

export function generateRefreshToken(user_id: string, user_name: string) {
    return jwt.sign({ user_id, user_name }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}