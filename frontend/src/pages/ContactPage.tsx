import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Building2, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitContactMessage } from '../api';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await submitContactMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] dark:bg-[#030303] text-stone-900 dark:text-zinc-50 font-sans selection:bg-amber-500/30 dark:selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      
      {/* Dark Mode Ambient Aurora Borealis & Noise Background */}
      <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none bg-[#020617]">
        {/* Real CSS Aurora Curtains */}
        <div className="absolute inset-0" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)', maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)' }}>
          <div className="absolute inset-[-50%] aurora-layer-1 opacity-40"></div>
          <div className="absolute inset-[-50%] aurora-layer-2 opacity-40"></div>
        </div>
        
        {/* Ultra-subtle SVG Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
      
      <div className="dark:hidden fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-200/30 blur-3xl opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-200/40 to-orange-100/30 blur-3xl opacity-70"></div>
        <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="w-full pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <Logo />
          </div>
        </nav>

        <main className="flex-grow flex items-center py-12 px-6">
          <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left Side: Copy & Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-6 tracking-tight">
                Let's start a <br /> conversation.
              </h1>
              <p className="text-lg text-stone-600 dark:text-zinc-400 mb-12 leading-relaxed max-w-md">
                Whether you have a question about pricing, need a custom implementation, or just want to say hi, our team is ready to help you protect your brand's reputation.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFDF8] dark:bg-[#0A0A0A] border border-amber-200/60 dark:border-white/5 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-amber-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-white mb-1">Email Us Directly</h3>
                    <p className="text-stone-600 dark:text-zinc-400 mb-2">For general inquiries and support.</p>
                    <a href="mailto:hello@tinkernlabs.com" className="text-amber-600 dark:text-indigo-400 font-semibold hover:underline">hello@tinkernlabs.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div>
              <div className="bg-[#FFFDF8]/80 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-2xl shadow-amber-900/5 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 dark:from-indigo-500 dark:to-indigo-400"></div>
                
                {success ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">Message Sent!</h3>
                    <p className="text-stone-600 dark:text-zinc-400 mb-8 max-w-sm">We've received your inquiry and will get back to you as soon as possible.</p>
                    <button onClick={() => setSuccess(false)} className="text-amber-600 dark:text-indigo-400 font-semibold hover:underline">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label className="text-sm font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-2">
                          <User className="w-4 h-4" /> Name *
                        </label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-amber-200 dark:border-white/10 focus:border-amber-500 dark:focus:border-indigo-500 outline-none text-stone-900 dark:text-white transition-colors" placeholder="Jane Doe" />
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label className="text-sm font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Email *
                        </label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-amber-200 dark:border-white/10 focus:border-amber-500 dark:focus:border-indigo-500 outline-none text-stone-900 dark:text-white transition-colors" placeholder="jane@example.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label className="text-sm font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Company
                        </label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-amber-200 dark:border-white/10 focus:border-amber-500 dark:focus:border-indigo-500 outline-none text-stone-900 dark:text-white transition-colors" placeholder="Optional" />
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label className="text-sm font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Phone
                        </label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-amber-200 dark:border-white/10 focus:border-amber-500 dark:focus:border-indigo-500 outline-none text-stone-900 dark:text-white transition-colors" placeholder="Optional" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-stone-700 dark:text-zinc-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Message *
                      </label>
                      <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-amber-200 dark:border-white/10 focus:border-amber-500 dark:focus:border-indigo-500 outline-none text-stone-900 dark:text-white transition-colors resize-none" placeholder="How can we help you?"></textarea>
                    </div>

                    <button disabled={loading} type="submit" className="w-full py-4 rounded-xl bg-amber-600 dark:bg-white text-white dark:text-indigo-900 font-bold text-lg hover:bg-amber-700 dark:hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                      {loading ? "Sending..." : "Send Message"} {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
