import { NextResponse } from 'next/server';
import { getTopTools } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch a bit more than 5 so admin can choose
        // In real app might want pagination or search, but top 20 is fine for now
        const tools = await getTopTools(20);

        return NextResponse.json({
            tools: tools.map((t: any) => ({
                id: t.slug, // Use slug as stable ID since 'id' might be missing
                name: t.name,
                stars: t.stars,
                description: t.description,
                category: t.category
            }))
        });
    } catch (error) {
        console.error('Error fetching tools:', error);
        return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }
}
