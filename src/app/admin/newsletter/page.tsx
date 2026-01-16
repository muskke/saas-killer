'use client';

import { Send, Lock, Eye, CheckCircle, RefreshCw } from 'lucide-react';
import { useNewsletter, Tool } from '@/hooks/useNewsletter';

export default function AdminNewsletterPage() {
    const {
        // 认证状态
        secret,
        setSecret,
        isAuthenticated,

        // 表单状态
        subject,
        setSubject,
        introText,
        setIntroText,
        outroText,
        setOutroText,
        testEmail,
        setTestEmail,

        // 工具状态
        availableTools,
        selectedToolIds,
        isLoadingTools,
        toggleTool,

        // 操作状态
        status,
        logs,
        previewHtml,

        // 操作函数
        fetchTools,
        handleLogin,
        handlePreview,
        handleSend,
    } = useNewsletter();

    // 登录界面
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-green-500 font-mono flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="max-w-md w-full space-y-4 border border-gray-200 dark:border-green-500/30 p-8 rounded-xl bg-white dark:bg-black/50 backdrop-blur shadow-lg">
                    <div className="flex justify-center mb-6">
                        <Lock size={48} className="text-gray-400 dark:text-green-500" />
                    </div>
                    <h1 className="text-xl text-center mb-8 font-bold tracking-widest text-gray-900 dark:text-green-500">SYSTEM_ACCESS_REQUIRED</h1>
                    <input
                        type="password"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="ENTER_ADMIN_SECRET"
                        aria-label="管理员密码"
                        className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-green-500/50 p-4 text-center focus:outline-none focus:border-indigo-500 dark:focus:border-green-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-green-500/20 rounded-lg transition-all"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 dark:bg-green-500/10 hover:bg-indigo-700 dark:hover:bg-green-500/20 text-white dark:text-green-400 border border-indigo-600 dark:border-green-500/50 py-3 uppercase tracking-widest transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Unlock Console
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-200 font-sans p-6 md:p-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 左侧：配置面板 */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar pr-2">

                    {/* 头部 */}
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <Send size={20} className="text-indigo-500" />
                            Console
                        </h1>
                        <div className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono rounded border border-indigo-200 dark:border-indigo-500/20">
                            v2.0
                        </div>
                    </div>

                    {/* 表单 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Ex: 🔥 Top 5 AI Tools of the Week"
                                aria-label="邮件主题"
                                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Intro Text (HTML Supported)</label>
                            <textarea
                                value={introText}
                                onChange={(e) => setIntroText(e.target.value)}
                                rows={3}
                                placeholder="Custom intro..."
                                aria-label="邮件开头文本"
                                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono"
                            />
                        </div>

                        {/* 工具选择器 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-mono text-gray-500 uppercase">Selected Tools ({selectedToolIds.length})</label>
                                <button
                                    onClick={fetchTools}
                                    className="text-gray-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                                    aria-label="刷新工具列表"
                                >
                                    <RefreshCw size={12} />
                                </button>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg max-h-[300px] overflow-y-auto">
                                {isLoadingTools ? (
                                    <div className="p-4 text-center text-xs text-gray-500 dark:text-zinc-500">Loading tools...</div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                        {availableTools.map((tool: Tool) => (
                                            <div
                                                key={tool.id}
                                                onClick={() => toggleTool(tool.id)}
                                                role="checkbox"
                                                aria-checked={selectedToolIds.includes(tool.id)}
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && toggleTool(tool.id)}
                                                className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${selectedToolIds.includes(tool.id) ? 'bg-indigo-50 dark:bg-indigo-500/5' : ''}`}
                                            >
                                                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedToolIds.includes(tool.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-zinc-600'}`}>
                                                    {selectedToolIds.includes(tool.id) && <CheckCircle size={10} className="text-white" />}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-medium text-sm truncate text-gray-900 dark:text-zinc-200">{tool.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1">⭐ {tool.stars}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-500 truncate">{tool.category}</div>
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
                                aria-label="邮件结尾文本"
                                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                            <div className="mb-4">
                                <label className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Test Email</label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="me@example.com"
                                    aria-label="测试邮件地址"
                                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handlePreview}
                                    type="button"
                                    className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <Eye size={16} /> Generate Preview
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={status === 'sending'}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <Send size={16} /> {testEmail ? 'Send Test' : 'Broadcast'}
                                </button>
                            </div>
                        </div>

                        {/* 日志 */}
                        <div className="mt-6 bg-gray-100 dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 p-3 h-40 overflow-y-auto font-mono text-[10px] text-gray-600 dark:text-zinc-400">
                            {logs.length === 0 && <span className="opacity-50">System ready.</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="mb-0.5">{log}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 右侧：预览面板 */}
                <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[calc(100vh-4rem)] shadow-sm">
                    <div className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 p-3 flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-500 dark:text-zinc-500 uppercase">Email Preview</span>
                        {previewHtml && (
                            <span className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1">
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
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-zinc-300">
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
