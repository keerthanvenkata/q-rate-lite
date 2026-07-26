import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion, useScroll, useTransform, useMotionValue, animate, useInView } from 'framer-motion';

function StatCounter({ value, suffix, decimal = false }: { value: number, suffix: string, decimal?: boolean }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      const unsubscribe = count.on("change", (latest) => {
        setDisplay(decimal ? latest.toFixed(1) : Math.round(latest).toLocaleString());
      });
      return () => { controls.stop(); unsubscribe(); };
    }
  }, [isInView, count, value, decimal]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function BentoCard({ children, className, variants }: { children: React.ReactNode, className: string, variants?: any }) {
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  };
  return (
    <motion.div 
      variants={variants}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot({ ...spot, active: false })}
    >
      <div
        style={{
          background: spot.active
            ? `radial-gradient(400px at ${spot.x}px ${spot.y}px, rgba(251,191,36,0.12), transparent 80%)`
            : 'none'
        }}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 dark:opacity-100 opacity-50 z-0"
      />
      {children}
    </motion.div>
  );
}
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
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroBadgeY = useTransform(scrollY, [0, 400], [0, -90]);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);
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
      <AnimatedBackground />

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              
              <motion.div style={{ y: heroBadgeY }} variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/50 dark:bg-white/5 border border-amber-200/50 dark:border-white/10 text-sm font-semibold text-amber-800 dark:text-zinc-300 mb-8 shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-indigo-400" />
                Built for High-Volume Cafés
              </motion.div>
              
              <motion.div style={{ y: heroY }} className="flex flex-col items-center">
                <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-stone-900 dark:text-white leading-[1.1] drop-shadow-sm">
                  Intercept negative feedback <br className="hidden md:block" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400 dark:from-indigo-400 dark:to-cyan-400">
                    before it hits Google.
                  </span>
                </motion.h1>
                
                <motion.p variants={fadeIn} className="text-lg md:text-xl text-stone-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                  The WhatsApp-first reputation engine. We capture unhappy customers privately, while automatically prompting your 5-star reviews to share on Google Maps.
                </motion.p>
                
                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <Link to="/signup" className="btn-sheen w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-stone-900/20 dark:shadow-white/10 flex items-center justify-center gap-2 group">
                    Start 14-Day Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                  <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFFDF8]/70 dark:bg-white/5 backdrop-blur-md border border-amber-200/80 dark:border-white/10 hover:bg-[#FFFDF8] dark:hover:bg-white/10 text-stone-900 dark:text-white font-semibold text-lg transition-colors shadow-sm">
                    See How It Works
                  </a>
                </motion.div>

                <motion.div variants={fadeIn} className="mt-16 grid grid-cols-3 gap-8 md:gap-16 text-center text-stone-900 dark:text-white">
                  <div>
                    <div className="text-3xl md:text-4xl font-black mb-1"><StatCounter value={1200} suffix="+" /></div>
                    <div className="text-xs md:text-sm font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">Cafés Served</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black mb-1"><StatCounter value={4.9} suffix="★" decimal /></div>
                    <div className="text-xs md:text-sm font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">Avg Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black mb-1"><StatCounter value={5} suffix=" min" /></div>
                    <div className="text-xs md:text-sm font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">Setup Time</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={sectionRef} id="how-it-works" className="py-24 px-6 bg-white dark:bg-transparent border-y border-amber-200/60 dark:border-white/5 relative z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-stone-900 dark:text-white tracking-tight">Zero friction workflow.</h2>
              <p className="text-lg text-stone-600 dark:text-zinc-400 max-w-2xl mx-auto">Customers interact through the app they already use 100 times a day: WhatsApp.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid md:grid-cols-3 gap-12 relative">
              {/* Premium Glowing Progress Line */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-amber-300 dark:via-indigo-500/50 to-transparent z-0 overflow-hidden">
                <motion.div style={{ width: lineWidth }} className="absolute inset-y-0 left-0 bg-amber-500 dark:bg-indigo-400 blur-[1px]"></motion.div>
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
              
              <BentoCard variants={fadeIn} className="lg:col-span-2 p-8 md:p-12 rounded-[2rem] bg-[#FFFDF8]/70 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-xl shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between group min-h-[400px] hover:-translate-y-1 dark:hover:border-white/10 transition-all duration-500">
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
              </BentoCard>

              <div className="flex flex-col gap-6">
                <BentoCard variants={fadeIn} className="flex-1 p-8 rounded-[2rem] bg-[#FFFDF8]/70 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-lg shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-center group hover:border-amber-300/80 dark:hover:border-white/10 hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-indigo-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <ShieldCheck className="w-10 h-10 text-amber-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Private Damage Control</h3>
                    <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed">Intercept 1-3 star reviews before they go public. Resolve issues directly.</p>
                  </div>
                </BentoCard>

                <BentoCard variants={fadeIn} className="flex-1 p-8 rounded-[2rem] bg-[#FFFDF8]/70 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-lg shadow-amber-900/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-center group hover:border-amber-300/80 dark:hover:border-white/10 hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-indigo-500/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <Gift className="w-10 h-10 text-amber-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="text-xl font-bold mb-3 text-stone-900 dark:text-white">Automated Loyalty</h3>
                    <p className="text-stone-600 dark:text-zinc-400 text-sm leading-relaxed">Issue unique, trackable discount codes to incentivize repeat visits.</p>
                  </div>
                </BentoCard>
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
              <div className="relative p-[2px] rounded-[2.5rem] overflow-hidden hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute inset-0 animate-border-spin" style={{ background: 'conic-gradient(from var(--angle), #f59e0b, #fde68a, #f59e0b, #b45309, #f59e0b)' }}></div>
                <div className="relative rounded-[2.4rem] bg-[#FFFDF8] dark:bg-[#0A0A0A] backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-amber-900/10 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Pro License</h3>
                    <div className="px-3 py-1 bg-amber-500 dark:bg-indigo-500 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                      Most Popular
                    </div>
                  </div>
                  <div className="mb-8 flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white">₹999</span>
                      <span className="text-stone-500 dark:text-zinc-400 font-medium text-lg">/month</span>
                    </div>
                    <p className="text-sm font-semibold text-amber-600 dark:text-indigo-400">Save ₹3,000+ vs competitors</p>
                  </div>
                  <motion.ul 
                    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-4 mb-10"
                  >
                    {[
                      "Unlimited Feedback Submissions",
                      "Unlimited WhatsApp Messaging",
                      "Automated Coupon Generation",
                      "Staff Dashboard Access",
                      "Export Data anytime",
                      "Priority Email Support"
                    ].map((feature, i) => (
                      <motion.li key={i} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                        <motion.div variants={{ hidden: { scale: 0 }, visible: { scale: 1, transition: { type: 'spring' } } }}>
                          <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                        </motion.div>
                        <span className="text-stone-600 dark:text-zinc-300 font-medium">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <div className="flex flex-col gap-3">
                    <Link to="/signup" className="btn-sheen block text-center w-full py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg hover:bg-stone-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-[0.98]">
                      Start 14-Day Free Trial
                    </Link>
                    <p className="text-center text-xs text-stone-500 font-medium">No credit card required. Cancel anytime.</p>
                  </div>
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
              <Link to="/signup" className="px-8 py-4 rounded-xl bg-white text-amber-900 dark:text-indigo-900 font-bold text-lg hover:-translate-y-1 transition-transform shadow-xl flex items-center justify-center gap-2 mx-auto group/btn w-fit">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
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
        <footer className="border-t border-amber-200/60 dark:border-white/5 py-12 px-6 bg-[#FAF3E0] dark:bg-zinc-950 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-200/40 dark:via-white/10 to-transparent"></div>
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <p className="italic text-stone-400 dark:text-zinc-600 font-medium">"Built for cafés that care about reputation."</p>
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-500 dark:text-zinc-500">
              <Logo />
              <p>© {new Date().getFullYear()} TinKern Labs. All rights reserved.</p>
              <div className="flex gap-8 font-medium">
                <Link to="/contact" className="hover:text-stone-900 dark:hover:text-white transition-colors">Contact</Link>
                <Link to="/privacy" className="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-stone-900 dark:hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
