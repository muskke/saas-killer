'use client';

import { Mail, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // 🚀 Internal API Route (Resend)
  const SUBSCRIBE_API = "/api/newsletter/subscribe";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    try {
      const response = await fetch(SUBSCRIBE_API, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        alert(data.error || "Something went wrong. Please try again.");
        setStatus('idle');
      }
    } catch (error) {
      alert("Network Error");
      setStatus('idle');
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-24 px-4">
      {/* Container: Minimalist Bar */}
      <div className="relative group rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden hover:border-indigo-500/30 transition-all duration-300">

        {/* Subtle decorative glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between p-1.5 gap-2 md:gap-4">

          {/* Label / Icon Area */}
          <div className="hidden md:flex items-center gap-3 pl-4 pr-2 text-gray-500 dark:text-zinc-500 select-none">
            <Terminal size={18} />
            <span className="font-mono text-xs font-medium tracking-wide border-r border-gray-200 dark:border-white/10 pr-4 py-1">
              WEEKLY_DIGEST
            </span>
          </div>

          {/* Form Area */}
          <div className="w-full flex-grow">
            {status === 'success' ? (
              <div className="flex items-center justify-center md:justify-start gap-2 text-green-600 dark:text-green-400 py-3 pl-2 font-mono text-sm">
                <CheckCircle2 size={16} />
                <span>Subscribed successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Join 5,000+ developers discovering tools..."
                  required
                  disabled={status === 'submitting'}
                  className="flex-grow bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 text-sm font-medium px-4 py-3 md:py-0 w-full"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="shrink-0 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 min-w-[100px]"
                >
                  {status === 'submitting' ? '...' : (
                    <>
                      <span>SUBSCRIBE</span>
                      <ArrowRight size={12} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer minimal text */}
      <div className="mt-4 flex justify-between px-2 text-[10px] text-gray-400 dark:text-zinc-600 font-mono uppercase tracking-wider opacity-60">
        <span>No spam, strictly code.</span>
        <span>Unsubscribe anytime.</span>
      </div>
    </section>
  );
}