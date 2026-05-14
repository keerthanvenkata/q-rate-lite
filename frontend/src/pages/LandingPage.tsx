import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  MessageSquare,
  QrCode, 
  TrendingUp, 
  ShieldCheck, 
  Gift,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const fadeIn: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] dark:bg-[#030303] text-stone-900 dark:text-zinc-50 font-sans selection:bg-amber-500/30 dark:selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      
      {/* Global Backgrounds */}

      {/* Authentic Dark Mode Curved Aurora Ribbons & Noise Background */}
      <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none bg-[#020617] overflow-hidden">
        
        {/* Far Layer: Deep Haze */}
        <div className="absolute inset-0 bg-slate-950/80 blur-[50px]"></div>

        {/* Mid Layer: Curved Hollow Ellipse Ribbons */}
        <div className="absolute inset-0 opacity-80 mix-blend-screen" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)', maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)' }}>
          {/* Ribbon 1: Primary Emerald Curve */}
          <div className="absolute top-[-50%] left-[-20%] w-[140vw] h-[80vh] border-[60px] border-emerald-500/25 rounded-[100%] blur-[40px] animate-[ribbon-wave-1_25s_ease-in-out_infinite]"></div>
          
          {/* Ribbon 2: Intersecting Teal Curve */}
          <div className="absolute top-[-40%] left-[-10%] w-[120vw] h-[90vh] border-[40px] border-teal-400/20 rounded-[100%] blur-[50px] animate-[ribbon-wave-2_30s_ease-in-out_infinite]"></div>
          
          {/* Ribbon 3: Deep Indigo Curve */}
          <div className="absolute top-[-60%] left-[10%] w-[160vw] h-[100vh] border-[80px] border-indigo-500/20 rounded-[100%] blur-[60px] animate-[ribbon-wave-3_35s_ease-in-out_infinite]"></div>
        </div>

        {/* Focal Bloom (keeps the area behind the headline softly lit) */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[50%] h-[30%] rounded-[100%] bg-teal-400/5 blur-[100px]"></div>
        
        {/* Animated Film Grain */}
        <div className="absolute inset-[-10%] opacity-[0.04] mix-blend-screen animate-noise-shift" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
      
      {/* Light Mode Creative Background (Floating Gradient Blob & Texture) */}
      <div className="dark:hidden fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAF3E0]">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-200/30 blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-yellow-200/40 to-orange-100/30 blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
        {/* Subtle SVG Noise Texture for Papyrus feel */}
        <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/50 dark:bg-white/5 border border-amber-200/50 dark:border-white/10 text-sm font-semibold text-amber-800 dark:text-zinc-300 mb-8 shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                Built for High-Volume Cafés
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-stone-900 dark:text-white leading-[1.1]">
                Intercept negative feedback <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400 dark:from-indigo-400 dark:to-cyan-400">
                  before it hits Google.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-stone-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The WhatsApp-first reputation engine. We capture unhappy customers privately, while automatically prompting your 5-star reviews to share on Google Maps.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-lg hover:bg-stone-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10 dark:shadow-white/5 group">
                  Start 14-Day Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFFDF8]/70 dark:bg-white/5 backdrop-blur-md border border-amber-200/80 dark:border-white/10 hover:bg-[#FFFDF8] dark:hover:bg-white/10 text-stone-900 dark:text-white font-semibold text-lg transition-colors shadow-sm">
                  See How It Works
                </a>
              </motion.div>

              <motion.div variants={fadeIn} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-stone-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-indigo-400" /> No app download</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-indigo-400" /> 5-minute setup</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-indigo-400" /> Cancel anytime</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-transparent border-y border-amber-200/60 dark:border-white/5 relative z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-stone-900 dark:text-white tracking-tight">Zero friction workflow.</h2>
              <p className="text-lg text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto">Customers interact through the app they already use 100 times a day: WhatsApp.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-12 relative">
              {/* Premium Glowing Progress Line */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-amber-300 dark:via-indigo-500/50 to-transparent z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white dark:via-indigo-400 to-transparent opacity-50 blur-[2px]"></div>
              </div>

              {[
                { step: "01", icon: QrCode, title: "Scan Physical QR", desc: "A beautiful, branded acrylic stand on their table prompts them to scan." },
                { step: "02", icon: Smartphone, title: "WhatsApp Opens", desc: "No apps. No sign-ups. WhatsApp opens with a pre-filled message." },
                { step: "03", icon: Gift, title: "Automated Routing", desc: "1-3 stars are kept private. 4-5 stars are pushed to Google. All get a coupon." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-3xl bg-[#FFFDF8] dark:bg-[#0A0A0A] border border-amber-200/60 dark:border-white/5 shadow-xl shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex items-center justify-center mb-6 group-hover:-translate-y-2 dark:group-hover:border-white/10 transition-all duration-500 backdrop-blur-md">
                    <item.icon className="w-10 h-10 text-amber-600 dark:text-indigo-400" strokeWidth={1.5} />
                  </div>
                  <div className="text-xs font-bold text-amber-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">{item.title}</h3>
                  <p className="text-stone-600 dark:text-zinc-400 leading-relaxed max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Bento Box Features Section */}
        <section id="features" className="py-24 px-6 bg-[#FAF3E0] dark:bg-transparent relative z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="mb-16 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-stone-900 dark:text-white tracking-tight">Engineered for growth.</h2>
              <p className="text-lg text-stone-600 dark:text-zinc-400 max-w-xl mx-auto md:mx-0">Every feature is designed to protect your brand reputation and drive repeat revenue.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <motion.div variants={fadeIn} className="lg:col-span-2 p-8 md:p-12 rounded-[2rem] bg-[#FFFDF8]/70 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-xl shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between group overflow-hidden relative min-h-[400px] hover:-translate-y-1 dark:hover:border-white/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-indigo-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF6EA] dark:bg-indigo-500/20 border border-amber-200/50 dark:border-indigo-500/30 flex items-center justify-center mb-8 text-amber-600 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-stone-900 dark:text-white tracking-tight">Boost Google Ratings Autonomously</h3>
                  <p className="text-stone-600 dark:text-zinc-400 text-lg max-w-lg leading-relaxed">
                    Our system intelligently identifies your happiest customers and seamlessly redirects them to your Google Maps review page, burying old negative reviews over time without lifting a finger.
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-col gap-6">
                <motion.div variants={fadeIn} className="flex-1 p-8 rounded-[2rem] bg-[#FFFDF8]/70 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-lg shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-center group hover:border-amber-300/80 dark:hover:border-white/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-indigo-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <ShieldCheck className="w-10 h-10 text-amber-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Private Damage Control</h3>
                    <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed">Intercept 1-3 star reviews before they go public. Resolve issues directly.</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className="flex-1 p-8 rounded-[2rem] bg-[#FFFDF8]/70 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-lg shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-center group hover:border-amber-300/80 dark:hover:border-white/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-indigo-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <Gift className="w-10 h-10 text-amber-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Automated Loyalty</h3>
                    <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed">Issue unique, trackable discount codes to incentivize repeat visits.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-[#FFFDF8]/40 dark:bg-zinc-900/30 backdrop-blur-lg border-y border-amber-200/50 dark:border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-stone-900 dark:text-white tracking-tight">Transparent pricing.</h2>
              <p className="text-lg text-stone-600 dark:text-zinc-400 max-w-xl mx-auto">No hidden fees, no complex tiers. Just everything you need to run your feedback engine.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeIn} className="max-w-lg mx-auto">
              <div className="rounded-[2.5rem] bg-[#FFFDF8] dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/60 dark:border-white/5 shadow-2xl shadow-amber-900/10 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative hover:-translate-y-1 dark:hover:border-white/10 transition-all duration-500">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 dark:from-indigo-500 dark:to-indigo-400"></div>
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Pro License</h3>
                    <div className="px-3 py-1 bg-[#FFF6EA] dark:bg-indigo-500/20 border border-amber-200/50 dark:border-indigo-500/30 text-amber-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                      Flat Rate
                    </div>
                  </div>
                  <div className="mb-8 flex items-baseline gap-2">
                    <span className="text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white">₹999</span>
                    <span className="text-stone-500 dark:text-zinc-400 font-medium text-lg">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {[
                      "Unlimited Feedback Submissions",
                      "Unlimited WhatsApp Messaging",
                      "Automated Coupon Generation",
                      "Staff Dashboard Access",
                      "Export Data anytime",
                      "Priority Email Support"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-stone-600 dark:text-zinc-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg hover:bg-stone-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-[0.98]">
                    Start 14-Day Free Trial
                  </button>
                  <p className="text-center text-xs text-stone-500 mt-4">No credit card required. Cancel anytime.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA & Contact Section */}
        <section className="py-24 px-6 relative max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Note: We separate the light/dark backgrounds completely using hidden/block layers to prevent Tailwind opacity bleed */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="lg:col-span-2 rounded-[3rem] relative overflow-hidden shadow-2xl shadow-amber-900/20 dark:shadow-[0_0_80px_rgba(79,70,229,0.07)] group border border-transparent dark:border-white/5 hover:dark:border-white/10 transition-colors duration-500 h-full flex flex-col justify-center">
            
            {/* Light Mode Background */}
            <div className="absolute inset-0 bg-amber-600 dark:hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Dark Mode Background */}
            <div className="absolute inset-0 hidden dark:block bg-[#0A0A0A]">
               {/* Dark Mode Animated Inner Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-indigo-500/10 blur-[100px] rounded-full transition-opacity duration-700 opacity-50 group-hover:opacity-100 pointer-events-none"></div>
            </div>

            <div className="relative z-10 px-6 py-20 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to transform your <br className="hidden sm:block"/> customer experience?</h2>
              <p className="text-amber-100 dark:text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Join the smart cafés using Q-Rate Lite to protect their brand and turn every customer into a regular.
              </p>
              <button className="px-8 py-4 rounded-xl bg-white text-amber-900 dark:text-indigo-900 font-bold text-lg hover:-translate-y-1 transition-transform shadow-xl flex items-center justify-center gap-2 mx-auto group/btn">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Contact Tile */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="lg:col-span-1 rounded-[3rem] bg-[#FFFDF8]/80 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-2xl shadow-amber-900/5 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden group hover:dark:border-white/10 transition-colors duration-500 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF3E0] dark:bg-white/5 flex items-center justify-center mb-6 shadow-sm border border-amber-200/60 dark:border-white/10">
               <MessageSquare className="w-8 h-8 text-amber-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">Have Questions?</h3>
            <p className="text-stone-600 dark:text-zinc-400 mb-8 leading-relaxed">We're here to help you get started, explore pricing, or customize a plan for your needs.</p>
            <Link to="/contact" className="w-full py-4 rounded-xl bg-stone-900 dark:bg-white/10 text-white font-bold hover:bg-stone-800 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-amber-200/60 dark:border-white/5 py-12 px-6 bg-[#FAF3E0] dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-500 dark:text-zinc-500">
            <Logo />
            <p>© {new Date().getFullYear()} TinKern Labs. All rights reserved.</p>
            <div className="flex gap-8 font-medium">
              <Link to="/privacy" className="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-stone-900 dark:hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
