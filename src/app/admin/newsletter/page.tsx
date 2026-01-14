'use client';

import { useState } from 'react';
import { Send, Lock, Eye, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminNewsletterPage() {
    const [secret, setSecret] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [testEmail, setTestEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, verify against API, but for this simple MVP we just gate the UI locally
        // The real check happens on the server API route
        if (secret) setIsAuthenticated(true);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !content) return;

        setStatus('sending');
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Starting broadcast...`, ...prev]);

        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    content, // In real app, this should be HTML. We'll send raw string for now
                    secret,
                    testEmail: testEmail || undefined
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setLogs(prev => [`[${new Date().toLocaleTimeString()}] ✅ Sent successfully to ${data.count} recipients.`, ...prev]);
            } else {
                setStatus('error');
                setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Error: ${data.error}`, ...prev]);
            }
        } catch (err) {
            setStatus('error');
            setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Network Error`, ...prev]);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="max-w-md w-full space-y-4 border border-green-500/30 p-8 rounded-xl bg-black/50 backdrop-blur">
                    <div className="flex justify-center mb-6">
                        <Lock size={48} />
                    </div>
                    <h1 className="text-xl text-center mb-8 font-bold tracking-widest">SYSTEM_ACCESS_REQUIRED</h1>
                    <input
                        type="password"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="ENTER_ADMIN_SECRET"
                        className="w-full bg-black border border-green-500/50 p-4 text-center focus:outline-none focus:border-green-400 focus:shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                    />
                    <button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 py-3 uppercase tracking-widest transition-all">
                        Unlock Console
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-gray-200 font-sans p-6 md:p-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Compose Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <Send size={24} className="text-indigo-500" />
                            Broadcast Console
                        </h1>
                        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-mono rounded border border-indigo-500/20">
                            MODE: {testEmail ? 'TEST' : 'LIVE'}
                        </div>
                    </div>

                    <form onSubmit={handleSend} className="space-y-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Ex: 5 New AI Tools You Missed..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Email Body (HTML/Text)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={12}
                                placeholder="<p>Hello world...</p>"
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <div className="flex-grow">
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Test Recipient (Optional)</label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="marketing@example.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    disabled={status === 'sending'}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {status === 'sending' ? 'Transmitting...' : (
                                        <>
                                            <Send size={18} /> Send Broadcast
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right: Status & Logs */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                        <h2 className="text-sm font-mono text-gray-500 uppercase mb-4">System_Logs</h2>
                        <div className="flex-grow bg-black rounded-lg p-4 font-mono text-xs overflow-y-auto max-h-[500px] space-y-2">
                            {logs.length === 0 && <span className="text-gray-700">Waiting for command...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className={`pb-1 border-b border-white/5 ${log.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                                    {log}
                                </div>
                            ))}
                        </div>

                        {status === 'success' && (
                            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
                                <CheckCircle size={20} />
                                <div>
                                    <div className="font-bold">Broadcast Complete</div>
                                    <div className="text-xs opacity-70">Message queued for delivery.</div>
                                </div>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                                <AlertCircle size={20} />
                                <div>
                                    <div className="font-bold">Transmission Failed</div>
                                    <div className="text-xs opacity-70">Check logs for details.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
