'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { Link2Off, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [retryCount, setRetryCount] = useState(0);

    // 抽取为 useCallback 以支持重试
    const performUnsubscribe = useCallback(async () => {
        if (!email) return;

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
    }, [email]);

    // 自动触发退订
    useEffect(() => {
        performUnsubscribe();
    }, [performUnsubscribe, retryCount]);

    // 重试函数
    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    if (!email) {
        return (
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 mb-4">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid Link</h1>
                <p className="text-gray-500 dark:text-zinc-400">No email address was provided.</p>
                <Link href="/" className="inline-block mt-8 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Unsubscribing...</h1>
                    <p className="text-gray-500 dark:text-zinc-400">Please wait while we update our records.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Successfully Unsubscribed</h1>
                    <p className="text-gray-500 dark:text-zinc-400">
                        You will no longer receive emails from SaaS Killer.<br />
                        We're sorry to see you go!
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <ArrowLeft size={16} /> Return to Website
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 mb-4">
                        <Link2Off size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
                    <p className="text-gray-500 dark:text-zinc-400">We couldn't process your request. Please try again.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <button
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <RefreshCw size={16} /> Try Again
                        </button>
                        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded">
                            Return to Home
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
            <Suspense fallback={<div className="text-gray-900 dark:text-white">Loading...</div>}>
                <UnsubscribeContent />
            </Suspense>
        </div>
    );
}
