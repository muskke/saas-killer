'use client';

import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // 🔥 替换成你刚才在 Formspree 拿到的 URL！
  const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail(''); // 清空输入框
      } else {
        alert("Something went wrong. Please try again.");
        setStatus('idle');
      }
    } catch (error) {
      alert("Error submitting form.");
      setStatus('idle');
    }
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto my-20 px-4">
      {/* 核心卡片容器 */}
      <div className="relative overflow-hidden bg-indigo-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-700">
        
        {/* 装饰背景：制造一种“发光”的高级感 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* 左侧：文案轰炸 */}
          <div className="text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-200 text-xs font-bold mb-6">
              <Mail size={14} />
              <span>Weekly Digest</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Stop Missing Out on <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Hidden Gems.
              </span>
            </h2>
            <p className="text-indigo-200 text-lg mb-6">
              Join 5,000+ developers receiving the latest open-source alternatives directly in their inbox. No spam, just code.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-indigo-300 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-400"/> Free forever</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-400"/> Unsubscribe anytime</span>
            </div>
          </div>

          {/* 右侧：行动表单 */}
          <div className="w-full max-w-md bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
            {status === 'success' ? (
              <div className="bg-green-500/20 text-green-300 p-8 rounded-xl text-center font-bold border border-green-500/30 flex flex-col items-center gap-2">
                <CheckCircle2 size={32} />
                <span>You're in! Welcome to the club.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter@your.email" 
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-4 rounded-xl bg-indigo-950/50 border border-indigo-700 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? 'Joining...' : 'Subscribe Now'}
                  {!status.startsWith('submit') && <ArrowRight size={18} />}
                </button>
              </form>
            )}
            <p className="text-center text-indigo-400/60 text-xs mt-3">
              We respect your privacy. Zero spam policy.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}