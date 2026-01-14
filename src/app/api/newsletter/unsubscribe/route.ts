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
            // 方案1: 直接用 email + audienceId 删除 (Resend v6+ 支持)
            const { data, error } = await resend.contacts.remove({
                audienceId: audienceId,
                email: email,
            });

            if (error) {
                console.error('Resend remove error:', error);
                // 如果删除失败,尝试方案2: 先查询再删除
                const listResult = await resend.contacts.list({ audienceId });
                if (listResult.data?.data) {
                    const contact = listResult.data.data.find((c: any) => c.email === email);
                    if (contact) {
                        await resend.contacts.remove({
                            audienceId: audienceId,
                            id: contact.id,
                        });
                        console.log(`Deleted contact by ID: ${contact.id}`);
                    }
                }
            } else {
                console.log('Contact removed:', data);
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
