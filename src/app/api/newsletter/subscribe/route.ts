import { NextResponse } from 'next/server';
import { resend, MARKETING_EMAILS } from '@/lib/resend';
import { getTopTools } from '@/lib/db';
import WelcomeEmail, { HotTool } from '@/emails/WelcomeEmail';

// 格式化星星数 (如 45000 -> "45k")
function formatStars(stars: number): string {
    if (stars >= 1000) {
        return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(stars);
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Add Contact to Resend Audience (for Unsubscribe support)
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (audienceId) {
            try {
                await resend.contacts.create({
                    email: email,
                    unsubscribed: false,
                    audienceId: audienceId
                });
            } catch (e) {
                console.error('Failed to create contact:', e);
                // Continue sending welcome email even if contact storage fails
            }
        }

        // 2. 获取实时热门工具数据
        let hotTools: HotTool[] = [];
        try {
            const tools = await getTopTools(3);
            hotTools = tools.map(tool => ({
                name: tool.name,
                description: tool.rich_features?.competitor_name
                    ? `${tool.rich_features.competitor_name} 的开源替代品`
                    : tool.description.slice(0, 50) + (tool.description.length > 50 ? '...' : ''),
                stars: formatStars(tool.stars),
                category: tool.category,
                url: tool.url
            }));
        } catch (e) {
            console.error('Failed to fetch top tools:', e);
            // Will use default tools in email template if this fails
        }

        // 3. Send Welcome Email with dynamic data
        const { data, error } = await resend.emails.send({
            from: MARKETING_EMAILS.welcome.from,
            to: email,
            subject: MARKETING_EMAILS.welcome.subject,
            react: WelcomeEmail({
                email,
                hotTools: hotTools.length > 0 ? hotTools : undefined // Use default if fetch failed
            }),
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Subscription Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
