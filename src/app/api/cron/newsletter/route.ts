import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getTopTools } from '@/lib/db';
import WeeklyDigestEmail, { HotTool } from '@/emails/WeeklyDigestEmail';

// 格式化星星数
function formatStars(stars: number): string {
    if (stars >= 1000) {
        return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(stars);
}

export async function GET(request: Request) {
    // 1. 安全验证 (Vercel Cron 会自动带上这个 Header)
    // 也可以手动设置 CRON_SECRET 环境变量来加强安全性
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const audienceId = process.env.RESEND_AUDIENCE_ID;
        if (!audienceId) {
            return NextResponse.json({ error: 'System configuration error: No Audience ID' }, { status: 500 });
        }

        // 2. 获取本周增长最快的前 5 个工具
        const tools = await getTopTools(5);
        if (tools.length === 0) {
            return NextResponse.json({ message: 'No tools to send' });
        }

        const hotTools: HotTool[] = tools.map((tool: any) => ({
            name: tool.name,
            description: tool.rich_features?.long_summary || tool.description, // Use AI summary if available for better quality
            stars: formatStars(tool.stars),
            category: tool.category,
            url: tool.url,
            growth: tool.star_growth ? `+${tool.star_growth}` : undefined,
            competitor: tool.rich_features?.competitor_name, // e.g. "Notion"
            feature: tool.rich_features?.pros?.[0], // Use the first 'Pro' as the Killer Feature
            bestFor: tool.rich_features?.best_for
        }));

        // 3. 获取所有订阅用户
        // 注意：contacts.list 可能有分页，这里简化版本只取第一页（Resend 默认 limit 可能限制）
        // 如果用户量大，需要循环分页获取
        const { data: contactsData, error: contactsError } = await resend.contacts.list({
            audienceId
        });

        if (contactsError) {
            console.error('Failed to list contacts:', contactsError);
            return NextResponse.json({ error: contactsError.message }, { status: 500 });
        }

        const subscribers = contactsData?.data || [];

        if (subscribers.length === 0) {
            return NextResponse.json({ message: 'No subscribers found' });
        }

        console.log(`Sending weekly digest to ${subscribers.length} subscribers...`);

        // 4. 批量发送邮件
        // Resend 支持 Batch Sending，但要注意限制。
        // 这里为了简单和错误隔离，我们使用 map + Promise.all (适合小规模)
        // 大规模应该用 resend.batch.send

        // 构造 Batch Email Payload (限制 100 封/次)
        // https://resend.com/docs/api-reference/batch-emails/send-batch-emails

        const BATCH_SIZE = 100;
        const batches = [];

        for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
            const chunk = subscribers.slice(i, i + BATCH_SIZE);
            const batchPayload = chunk.map(sub => ({
                from: 'SaaS Killer <hello@saas-killer.chaos-meme.cn>',
                to: sub.email,
                subject: `🔥 Weekly Top 5: ${hotTools[0].name} & more`,
                react: WeeklyDigestEmail({ hotTools })
            }));
            batches.push(batchPayload);
        }

        // 执行批量发送
        for (const batch of batches) {
            const { error } = await resend.batch.send(batch);
            if (error) {
                console.error('Batch send error:', error);
                // 继续发送下一批
            }
        }

        return NextResponse.json({
            success: true,
            sent_count: subscribers.length,
            top_tool: hotTools[0].name
        });

    } catch (error) {
        console.error('Cron Job Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
