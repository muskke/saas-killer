import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { getTopTools } from '@/lib/db';
import WeeklyDigestEmail, { HotTool } from '@/emails/WeeklyDigestEmail';
import { render } from '@react-email/render';

// Simple protection
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'secret123';

// Helper to format stars
function formatStars(stars: number): string {
    if (stars >= 1000) {
        return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(stars);
}

export async function POST(request: Request) {
    try {
        const {
            subject,
            secret,
            testEmail,
            toolIds,
            introText,
            outroText,
            preview
        } = await request.json();

        // 1. Verify Secret
        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!subject && !preview) { // Subject required for sending
            return NextResponse.json({ error: 'Missing subject' }, { status: 400 });
        }

        // 2. Fetch Data
        let tools = [];
        if (toolIds && toolIds.length > 0) {
            // In a real app we'd fetch specific IDs. 
            // `getTopTools` matches the current DB abstraction which is simple.
            // For this MVP, we will fetch top 50 and filter by ID in memory to avoid changing `db.ts` too much right now.
            const allTools = await getTopTools(50);
            tools = allTools.filter((t: any) => toolIds.includes(t.id));

            // Maintain order of selection if possible, but basic filter is okay for now
        } else {
            tools = await getTopTools(5);
        }

        if (tools.length === 0) {
            return NextResponse.json({ error: 'No tools selected or found' }, { status: 400 });
        }

        // 3. Prepare Email Props
        const hotTools: HotTool[] = tools.map((tool: any) => ({
            name: tool.name,
            description: tool.rich_features?.long_summary || tool.description,
            stars: formatStars(tool.stars),
            category: tool.category,
            url: tool.url,
            growth: tool.star_growth ? `+${tool.star_growth}` : undefined,
            competitor: tool.rich_features?.competitor_name,
            feature: tool.rich_features?.pros?.[0],
            bestFor: tool.rich_features?.best_for
        }));

        const emailElement = WeeklyDigestEmail({
            hotTools,
            introText,
            outroText
        });

        // 4. Handle Preview
        if (preview) {
            const html = await render(emailElement);
            return NextResponse.json({ success: true, html });
        }

        // 5. Handle Sending
        const audienceId = process.env.RESEND_AUDIENCE_ID;
        let recipients: string[] = [];

        if (testEmail) {
            recipients = [testEmail];
        } else {
            // Broadcast mode - fetch audience if configured
            if (audienceId) {
                const { data: contactsData } = await resend.contacts.list({ audienceId });
                if (contactsData?.data) {
                    recipients = contactsData.data.map(c => c.email);
                }
            }

            // Fallback if no audience or empty
            if (recipients.length === 0) {
                // Prevent accidental broadcast to 0 people being confusing
                return NextResponse.json({ error: 'No recipients found (Audience empty or not configured)' }, { status: 400 });
            }
        }

        console.log(`Sending newsletter to ${recipients.length} recipients...`);

        // Batch send logic (simplified for this endpoint, identical to cron logic usually)
        // For test email (single), simpler call:
        if (recipients.length === 1) {
            const { error } = await resend.emails.send({
                from: 'SaaS Killer <hello@saas-killer.chaos-meme.cn>',
                to: recipients[0],
                subject: subject,
                react: emailElement,
            });
            if (error) throw error;
        } else {
            // Batch send
            const BATCH_SIZE = 100;
            const batches = [];

            for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
                const chunk = recipients.slice(i, i + BATCH_SIZE);
                const batchPayload = chunk.map(email => ({
                    from: 'SaaS Killer <hello@saas-killer.chaos-meme.cn>',
                    to: email,
                    subject: subject,
                    react: emailElement
                }));
                batches.push(batchPayload);
            }

            for (const batch of batches) {
                await resend.batch.send(batch);
            }
        }

        return NextResponse.json({ success: true, count: recipients.length });

    } catch (error: any) {
        console.error('Send Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
