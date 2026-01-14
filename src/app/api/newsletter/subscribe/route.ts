import { NextResponse } from 'next/server';
import { resend, MARKETING_EMAILS } from '@/lib/resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Send Welcome Email
        const { data, error } = await resend.emails.send({
            from: MARKETING_EMAILS.welcome.from,
            to: email,
            subject: MARKETING_EMAILS.welcome.subject,
            react: WelcomeEmail({ email }),
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 2. (Optional) Create Contact in Resend Audience
        // For now we just send the email, but you can uncomment this to store contacts in Resend
        /*
        await resend.contacts.create({
          email: email,
          firstName: '',
          lastName: '',
          unsubscribed: false,
          audienceId: 'YOUR_AUDIENCE_ID'
        });
        */

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Subscription Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
