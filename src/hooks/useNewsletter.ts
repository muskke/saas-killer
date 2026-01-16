'use client';

import { useState, useEffect, useCallback } from 'react';

// 工具类型定义
export interface Tool {
    id: string;
    name: string;
    description: string;
    stars: number;
    category: string;
}

// 发送状态类型
export type SendStatus = 'idle' | 'sending' | 'success' | 'error' | 'previewing';

// Hook 返回类型
export interface UseNewsletterReturn {
    // 认证状态
    secret: string;
    setSecret: (value: string) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;

    // 表单状态
    subject: string;
    setSubject: (value: string) => void;
    introText: string;
    setIntroText: (value: string) => void;
    outroText: string;
    setOutroText: (value: string) => void;
    testEmail: string;
    setTestEmail: (value: string) => void;

    // 工具状态
    availableTools: Tool[];
    selectedToolIds: string[];
    isLoadingTools: boolean;
    toggleTool: (id: string) => void;

    // 操作状态
    status: SendStatus;
    logs: string[];
    previewHtml: string | null;

    // 操作函数
    fetchTools: () => Promise<void>;
    handleLogin: (e: React.FormEvent) => void;
    handlePreview: () => Promise<void>;
    handleSend: (e: React.FormEvent) => Promise<void>;
}

/**
 * 自定义 Hook：封装 Newsletter 管理页面的所有业务逻辑
 */
export function useNewsletter(): UseNewsletterReturn {
    // 认证状态
    const [secret, setSecret] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 表单状态
    const [subject, setSubject] = useState('');
    const [introText, setIntroText] = useState('');
    const [outroText, setOutroText] = useState('');
    const [testEmail, setTestEmail] = useState('');

    // 工具状态
    const [availableTools, setAvailableTools] = useState<Tool[]>([]);
    const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
    const [isLoadingTools, setIsLoadingTools] = useState(false);

    // 操作状态
    const [status, setStatus] = useState<SendStatus>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

    // 添加日志
    const addLog = useCallback((msg: string, isError = false) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${isError ? '❌ ' : ''}${msg}`, ...prev]);
    }, []);

    // 获取工具列表
    const fetchTools = useCallback(async () => {
        setIsLoadingTools(true);
        try {
            const res = await fetch('/api/newsletter/tools');
            const data = await res.json();
            if (data.tools) {
                setAvailableTools(data.tools);
                // 默认选中前 5 个
                setSelectedToolIds(data.tools.slice(0, 5).map((t: Tool) => t.id));
            }
        } catch (e) {
            console.error(e);
            addLog('Failed to fetch tools', true);
        } finally {
            setIsLoadingTools(false);
        }
    }, [addLog]);

    // 认证后自动获取工具
    useEffect(() => {
        if (isAuthenticated) {
            fetchTools();
        }
    }, [isAuthenticated, fetchTools]);

    // 登录处理
    const handleLogin = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (secret) setIsAuthenticated(true);
    }, [secret]);

    // 预览处理
    const handlePreview = useCallback(async () => {
        setStatus('previewing');
        setPreviewHtml(null);
        addLog('Generating preview...');

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
    }, [subject, secret, introText, outroText, selectedToolIds, addLog]);

    // 发送处理
    const handleSend = useCallback(async (e: React.FormEvent) => {
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
    }, [subject, secret, introText, outroText, selectedToolIds, testEmail, addLog]);

    // 切换工具选中状态
    const toggleTool = useCallback((id: string) => {
        setSelectedToolIds(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    }, []);

    return {
        // 认证状态
        secret,
        setSecret,
        isAuthenticated,
        setIsAuthenticated,

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
    };
}
