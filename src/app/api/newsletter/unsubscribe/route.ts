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

        try {
            // 根据 Resend 官方文档，用 email 删除时不需要传 audienceId
            // https://resend.com/docs/api-reference/contacts/delete-contact
            const { data, error } = await resend.contacts.remove({
                email: email,
            });

            if (error) {
                console.error('Resend remove error:', error);
            } else {
                console.log('Contact removed successfully:', data);
            }

            return NextResponse.json({ success: true });
        } catch (error: any) {
            console.error('Resend Unsubscribe Error:', error);
            // 即使出错也返回成功,避免用户困惑
            return NextResponse.json({ success: true, message: 'Processed' });
        }

    } catch (error) {
        console.error('Unsubscribe Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
