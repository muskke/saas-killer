'use client';

import { useState, useEffect } from 'react';
import { Send, Lock, Eye, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';

interface Tool {
    id: string;
    name: string;
    description: string;
    stars: number;
    category: string;
}

export default function AdminNewsletterPage() {
    const [secret, setSecret] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [introText, setIntroText] = useState('');
    const [outroText, setOutroText] = useState('');
    const [testEmail, setTestEmail] = useState('');

    // Tools State
    const [availableTools, setAvailableTools] = useState<Tool[]>([]);
    const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
    const [isLoadingTools, setIsLoadingTools] = useState(false);

    // Status State
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'previewing'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

    // Data Fetching
    useEffect(() => {
        if (isAuthenticated) {
            fetchTools();
        }
    }, [isAuthenticated]);

    const fetchTools = async () => {
        setIsLoadingTools(true);
        try {
            const res = await fetch('/api/newsletter/tools');
            const data = await res.json();
            if (data.tools) {
                setAvailableTools(data.tools);
                // Pre-select top 5 by default
                setSelectedToolIds(data.tools.slice(0, 5).map((t: Tool) => t.id));
            }
        } catch (e) {
            console.error(e);
            addLog('Failed to fetch tools', true);
        } finally {
            setIsLoadingTools(false);
        }
    };

    const addLog = (msg: string, isError = false) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${isError ? '❌ ' : ''}${msg}`, ...prev]);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (secret) setIsAuthenticated(true);
    };

    const handlePreview = async () => {
        setStatus('previewing');
        setPreviewHtml(null);
        addLog('Generating preview...');

        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject, // Optional for preview but good to pass
                    secret,
                    introText,
                    outroText,
                    toolIds: selectedToolIds,
                    preview: true
                }),
            });
            const data = await res.json();
            if (data.success && data.html) {
                setPreviewHtml(data.html);
                addLog('Preview generated.');
                setStatus('idle');
            } else {
                addLog(`Preview failed: ${data.error}`, true);
                setStatus('error');
            }
        } catch (e) {
            addLog('Network error during preview', true);
            setStatus('error');
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject) {
            addLog('Subject is required', true);
            return;
        }

        setStatus('sending');
        addLog('Starting transmission...');

        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    secret,
                    introText,
                    outroText,
                    toolIds: selectedToolIds,
                    testEmail: testEmail || undefined
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                addLog(`✅ Sent successfully to ${data.count} recipients.`);
            } else {
                setStatus('error');
                addLog(`Error: ${data.error}`, true);
            }
        } catch (err) {
            setStatus('error');
            addLog('Network Error', true);
        }
    };

    const toggleTool = (id: string) => {
        setSelectedToolIds(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
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
        <div className="min-h-screen bg-zinc-950 text-gray-200 font-sans p-6 md:p-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Configuration (4 cols) */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar pr-2">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Send size={20} className="text-indigo-500" />
                            Console
                        </h1>
                        <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-mono rounded border border-indigo-500/20">
                            v2.0
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Ex: 🔥 Top 5 AI Tools of the Week"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Intro Text (HTML Supported)</label>
                            <textarea
                                value={introText}
                                onChange={(e) => setIntroText(e.target.value)}
                                rows={3}
                                placeholder="Custom intro..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-colors font-mono"
                            />
                        </div>

                        {/* Tool Selector */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-mono text-gray-500 uppercase">Selected Tools ({selectedToolIds.length})</label>
                                <button onClick={fetchTools} className="text-zinc-500 hover:text-white transition-colors">
                                    <RefreshCw size={12} />
                                </button>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-h-[300px] overflow-y-auto">
                                {isLoadingTools ? (
                                    <div className="p-4 text-center text-xs text-zinc-500">Loading tools...</div>
                                ) : (
                                    <div className="divide-y divide-zinc-800">
                                        {availableTools.map(tool => (
                                            <div
                                                key={tool.id}
                                                onClick={() => toggleTool(tool.id)}
                                                className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-zinc-800/50 transition-colors ${selectedToolIds.includes(tool.id) ? 'bg-indigo-500/5' : ''}`}
                                            >
                                                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedToolIds.includes(tool.id) ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                                                    {selectedToolIds.includes(tool.id) && <CheckCircle size={10} className="text-white" />}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-medium text-sm truncate text-zinc-200">{tool.name}</div>
                                                        <div className="text-xs text-zinc-500 flex items-center gap-1">⭐ {tool.stars}</div>
                                                    </div>
                                                    <div className="text-xs text-zinc-500 truncate">{tool.category}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Outro Text</label>
                            <textarea
                                value={outroText}
                                onChange={(e) => setOutroText(e.target.value)}
                                rows={2}
                                placeholder="See you next week..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-colors font-mono"
                            />
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            <div className="mb-4">
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Test Email</label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="me@example.com"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handlePreview}
                                    type="button"
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} /> Generate Preview
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={status === 'sending'}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send size={16} /> {testEmail ? 'Send Test' : 'Broadcast'}
                                </button>
                            </div>
                        </div>

                        {/* Logs */}
                        <div className="mt-6 bg-black rounded border border-zinc-800 p-3 h-40 overflow-y-auto font-mono text-[10px] text-zinc-400">
                            {logs.length === 0 && <span className="opacity-50">System ready.</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="mb-0.5">{log}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview (8 cols) */}
                <div className="lg:col-span-8 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
                    <div className="bg-zinc-950 border-b border-zinc-800 p-3 flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-500 uppercase">Email Preview</span>
                        {previewHtml && (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <CheckCircle size={12} /> Generated
                            </span>
                        )}
                    </div>
                    <div className="flex-grow bg-white relative">
                        {previewHtml ? (
                            <iframe
                                srcDoc={previewHtml}
                                className="w-full h-full border-0"
                                title="Email Preview"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                <div className="text-center">
                                    <Eye size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Click "Generate Preview" to see the email</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
