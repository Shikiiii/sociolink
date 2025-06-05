import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const maybeAuthedReq = await authMiddleware(req as any);
    if (maybeAuthedReq instanceof NextResponse) return maybeAuthedReq;

    const userId = maybeAuthedReq.user.user_id;
    const body = await req.json();

    if (!Array.isArray(body.socials)) {
        return NextResponse.json({ error: 'Input must be an array.' }, { status: 400 });
    }

    // Validate all inputs
    for (const item of body.socials) {
        const { type, link, text, order } = item;
        if (typeof type !== 'string' || !type.trim()) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }
        if (typeof link !== 'string' || !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(link)) {
            return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
        }
        if (typeof text !== 'string' || text.length < 3 || text.length > 60) {
            return NextResponse.json({ error: 'Text must be between 3 and 60 characters' }, { status: 400 });
        } else if (typeof text === null || text.length === 0) {
            item.text = item.type;
        }
        if (typeof order !== 'number') {
            return NextResponse.json({ error: 'Order must be a number.' }, { status: 400 });
        }
    }

    // Find the user's website
    const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: { user_website: { include: { socials: true } } }
    });

    if (!user || !user.user_website) {
        return NextResponse.json({ error: 'User website not found' }, { status: 404 });
    }

    const websiteId = user.user_website.id;
    const existingSocials = user.user_website.socials;

    // Prepare sets for comparison
    const inputSet = new Set(body.socials.map((item: any) => `${item.type}|${item.link}|${item.text}`));
    const existingSet = new Set(existingSocials.map(s => `${s.type}|${s.link}|${s.text}`));

    // Find socials to add (not in existing)
    const toAdd = body.socials.filter((item: any) => !existingSet.has(`${item.type}|${item.link}|${item.text}`));

    // Find socials to remove (not in input)
    const toRemove = existingSocials.filter(s => !inputSet.has(`${s.type}|${s.link}|${s.text}`));

    // Add new socials
    const created = [];
    for (const item of toAdd) {
        const social = await prisma.social.create({
            data: {
                type: item.type,
                link: item.link,
                text: item.text,
                order: item.order,
                websiteId
            }
        });
        created.push(social);
    }

    // Remove socials not in input
    for (const s of toRemove) {
        await prisma.social.delete({ where: { id: s.id } });
    }

    // Optionally, update order for existing socials if changed
    for (const item of body.socials) {
        const existing = existingSocials.find(s => s.type === item.type && s.link === item.link && s.text === item.text);
        if (existing && existing.order !== item.order) {
            await prisma.social.update({
                where: { id: existing.id },
                data: { order: item.order }
            });
        }
    }

    // Return the updated list
    const updatedSocials = await prisma.social.findMany({ where: { websiteId } });
    return NextResponse.json(updatedSocials, { status: 200 });
}