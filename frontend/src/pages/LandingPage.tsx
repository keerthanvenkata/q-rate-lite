import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
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
  // Theme Toggle Logic
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center shadow-sm">
              <MessageCircle className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Q-Rate <span className="text-zinc-500 dark:text-zinc-400 font-normal">Lite</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/staff" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Staff Login
            </Link>
            <a href="#pricing" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
              Get Started
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              className="p-2 text-zinc-600 dark:text-zinc-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 dark:text-zinc-300">How it Works</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 dark:text-zinc-300">Features</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 dark:text-zinc-300">Pricing</a>
            <Link to="/staff" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 dark:text-zinc-300">Staff Login</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-8 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              Built for High-Volume Cafés
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-zinc-900 dark:text-white leading-[1.1]">
              Intercept negative feedback <br className="hidden md:block" />
              <span className="text-indigo-600 dark:text-indigo-400">
                before it hits Google.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The WhatsApp-first reputation engine. We capture unhappy customers privately, while automatically prompting your 5-star reviews to share on Google Maps.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-white/10 group">
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-900 dark:text-white font-semibold text-lg transition-colors shadow-sm">
                See How It Works
              </a>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> No app download</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 5-minute setup</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Cancel anytime</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">Zero friction workflow.</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Customers interact through the app they already use 100 times a day: WhatsApp.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[48px] left-[20%] right-[20%] h-[1px] bg-zinc-200 dark:bg-zinc-800 z-0"></div>

            {[
              {
                step: "01",
                icon: QrCode,
                title: "Scan Physical QR",
                desc: "A beautiful, branded acrylic stand on their table prompts them to scan."
              },
              {
                step: "02",
                icon: Smartphone,
                title: "WhatsApp Opens",
                desc: "No apps. No sign-ups. WhatsApp opens with a pre-filled message."
              },
              {
                step: "03",
                icon: Gift,
                title: "Automated Routing",
                desc: "1-3 stars are kept private. 4-5 stars are pushed to Google. All get a coupon."
              }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl dark:shadow-2xl flex items-center justify-center mb-6 relative">
                  <item.icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm border-2 border-white dark:border-zinc-900 shadow-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Box Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">Engineered for growth.</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">Every feature is designed to protect your brand reputation and drive repeat revenue.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
          >
            {/* Large Bento Box */}
            <motion.div variants={fadeIn} className="md:col-span-2 md:row-span-2 p-8 md:p-12 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-500/5 dark:to-zinc-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">Boost Google Ratings Autonomously</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md leading-relaxed">
                  Our system intelligently identifies your happiest customers and seamlessly redirects them to your Google Maps review page, burying old negative reviews over time.
                </p>
              </div>
            </motion.div>

            {/* Medium Bento Box */}
            <motion.div variants={fadeIn} className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-6" />
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Private Damage Control</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Intercept 1-3 star reviews before they go public. Resolve issues directly.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <Gift className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-6" />
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Automated Loyalty</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Issue unique, trackable discount codes to incentivize repeat visits.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800/50 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">Transparent pricing.</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">No hidden fees, no complex tiers. Just everything you need to run your feedback engine.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className="max-w-lg mx-auto"
          >
            <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl dark:shadow-2xl dark:shadow-zinc-950/50 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></div>
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Pro License</h3>
                  <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wide">
                    Flat Rate
                  </div>
                </div>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">₹999</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">/month</span>
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
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-[0.98]">
                  Start 14-Day Free Trial
                </button>
                <p className="text-center text-xs text-zinc-500 mt-4">No credit card required. Cancel anytime.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-5xl mx-auto rounded-[3rem] bg-indigo-600 dark:bg-indigo-600 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle structural background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 px-6 py-20 md:py-24 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to transform your <br className="hidden sm:block"/> customer experience?</h2>
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join the smart cafés using Q-Rate Lite to protect their brand and turn every customer into a regular.
            </p>
            <button className="px-8 py-4 rounded-xl bg-white text-indigo-900 font-bold text-lg hover:-translate-y-1 transition-transform shadow-xl flex items-center justify-center gap-2 mx-auto">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/50 py-12 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500 dark:text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white dark:text-zinc-900" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-300 text-base">Q-Rate Lite</span>
          </div>
          <p>© {new Date().getFullYear()} Q-Rate Lite. All rights reserved.</p>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
