import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

// Simple protection
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'secret123';

export async function POST(request: Request) {
    try {
        const { subject, content, secret, testEmail } = await request.json();

        // 1. Verify Secret
        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!subject || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 2. Send Email
        // If 'testEmail' is provided, send only to that. Otherwise, this would need to iterate over a list
        // OR use Resend's "Broadcast" feature if implementing audiences.
        // For this MVP, we will just demonstrate sending to a specific test list or the test email.

        // In a real app with local storage, you'd read `subscribers.csv` here.
        // Since we are moving to Resend interactions, we ideally use Resend Audiences.
        // For safety, this initial version ONLY sends to the 'testEmail' provided to prevent accidental spam.

        const recipients = testEmail ? [testEmail] : ['your-own-email@example.com']; // Safety net

        const { data, error } = await resend.emails.send({
            from: 'SaaS Killer <hello@saas-killer.chaos-meme.cn>',
            to: recipients,
            subject: subject,
            html: content, // We assume Admin sends raw HTML or simple text for now
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: recipients.length });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
