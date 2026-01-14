'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Link2Off, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (!email) return;

        // Auto-trigger unsubscribe if email is present
        const unsubscribe = async () => {
            setStatus('processing');
            try {
                const res = await fetch('/api/newsletter/unsubscribe', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (e) {
                setStatus('error');
            }
        };

        unsubscribe();
    }, [email]);

    if (!email) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 text-zinc-500 mb-4">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white">Invalid Link</h1>
                <p className="text-zinc-400">No email address was provided.</p>
                <Link href="/" className="inline-block mt-8 text-indigo-400 hover:text-indigo-300">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center space-y-6">
            {status === 'processing' && (
                <>
                    <div className="inline-block animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                    <h1 className="text-2xl font-bold text-white">Unsubscribing...</h1>
                    <p className="text-zinc-400">Please wait while we update our records.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Successfully Unsubscribed</h1>
                    <p className="text-zinc-400">
                        You will no longer receive emails from SaaS Killer.<br />
                        We're sorry to see you go!
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:bg-zinc-800 transition-colors">
                        <ArrowLeft size={16} /> Return to Website
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4">
                        <Link2Off size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                    <p className="text-zinc-400">We couldn't process your request. Please try again later.</p>
                    <Link href="/" className="inline-block mt-8 text-indigo-400 hover:text-indigo-300">
                        Return to Home
                    </Link>
                </>
            )}
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <UnsubscribeContent />
            </Suspense>
        </div>
    );
}
