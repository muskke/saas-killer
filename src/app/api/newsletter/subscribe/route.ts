import { NextResponse } from 'next/server';
import { resend, MARKETING_EMAILS } from '@/lib/resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

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

        // 2. Send Welcome Email
        const { data, error } = await resend.emails.send({
            from: MARKETING_EMAILS.welcome.from,
            to: email,
            subject: MARKETING_EMAILS.welcome.subject,
            react: WelcomeEmail({ email }),
            // headers: { 'List-Unsubscribe': ... } // Resend handles this if using Audiences or can be added manually
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
