import { NextResponse } from 'next/server';
import { getAllTools } from '@/lib/db';

export async function GET() {
    const allTools = await getAllTools();

    // Slim down - match the logic in page.tsx
    const slimTools = allTools.map((tool) => ({
        slug: tool.slug,
        name: tool.name,
        description: tool.description?.slice(0, 100) + (tool.description && tool.description.length > 100 ? '...' : ''),
        category: tool.category,
        parent_category: tool.parent_category,
        subcategory: tool.subcategory,
        stars: tool.stars,
        logo: tool.logo,
        rich_features: {
            competitor_name: tool.rich_features?.competitor_name
        }
    })).sort((a: any, b: any) => b.stars - a.stars);

    return NextResponse.json(slimTools, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
