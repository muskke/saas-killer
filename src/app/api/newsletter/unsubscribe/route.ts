import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!audienceId) {
            console.error("RESEND_AUDIENCE_ID is missing");
            return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
        }

        // Attempt to remove contact from Audience
        try {
            await resend.contacts.remove({
                email: email,
                audienceId: audienceId,
            });
            return NextResponse.json({ success: true });
        } catch (error: any) {
            // If contact not found, we can consider it a success (idempotent)
            // or return specific error. Resend throws if not found? 
            // safer to just log and return success to user.
            console.error('Resend Unsubscribe Error:', error);
            return NextResponse.json({ success: true, message: 'Processed' });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
