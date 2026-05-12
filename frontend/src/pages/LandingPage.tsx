import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  QrCode, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  Gift,
  ArrowRight,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-fuchsia-500/30 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Q-Rate <span className="text-slate-400 font-normal">Lite</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/staff" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
              Staff Login
            </Link>
            <a href="#pricing" className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 text-sm font-medium text-violet-300 mb-8 backdrop-blur-md shadow-xl">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
              Built for Independent Cafés
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]">
              Catch negative feedback <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500">
                before it hits Google.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The WhatsApp-first feedback system that intercepts unhappy customers privately, while automatically rewarding 5-star reviews with a unique discount coupon.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-lg hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-white font-semibold text-lg backdrop-blur-sm transition-all duration-300">
                See How It Works
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No app download required</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Setup in 5 minutes</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cancel anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple for you. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Magical for them.</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">No apps to download, no clunky tablets. Just the app your customers already use every day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/30 to-fuchsia-500/0 z-0"></div>

            {[
              {
                step: "01",
                icon: QrCode,
                title: "Customer Scans QR",
                desc: "They scan a beautiful physical QR code placed on their table, immediately opening their WhatsApp."
              },
              {
                step: "02",
                icon: Smartphone,
                title: "Instant Chatbot Reply",
                desc: "They send a pre-filled message. Our bot instantly replies with a secure link to your branded feedback web app."
              },
              {
                step: "03",
                icon: Gift,
                title: "Feedback & Reward",
                desc: "They leave a star rating. 1-3 stars are kept private. 4-5 stars are prompted to post on Google. Everyone gets a coupon!"
              }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex items-center justify-center mb-8 relative overflow-hidden group-hover:border-violet-500/50 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <item.icon className="w-10 h-10 text-violet-400 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-500">{item.step}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/40 border-y border-slate-800/50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <span className="text-white">grow.</span></h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Purpose-built tools to protect your reputation and drive repeat business automatically.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Private Damage Control",
                desc: "Intercept 1-3 star reviews before they go public. Resolve issues directly with the customer privately."
              },
              {
                icon: TrendingUp,
                title: "Boost Google Ratings",
                desc: "Automatically prompt your happiest (4-5 star) customers to share their experience on Google Maps."
              },
              {
                icon: Gift,
                title: "Automated Loyalty",
                desc: "Issue unique, trackable 6-digit discount codes to incentivize both feedback and repeat visits."
              },
              {
                icon: MessageCircle,
                title: "WhatsApp Native",
                desc: "Zero friction. No apps, no accounts to create. Your customers interact through the app they already love."
              },
              {
                icon: Star,
                title: "Beautiful Web App",
                desc: "A sleek, fast, and branded feedback form that looks amazing on any smartphone."
              },
              {
                icon: QrCode,
                title: "Physical QR Kits",
                desc: "Download high-quality, print-ready QR codes designed to match your café's aesthetic."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:bg-slate-800/90 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/20">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:bg-violet-600/20 group-hover:border-violet-500/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-violet-400 group-hover:text-violet-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing.</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">One flat monthly rate. Unlimited feedback. Cancel anytime.</p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-violet-500/40 via-fuchsia-500/20 to-slate-800 shadow-2xl shadow-violet-900/20 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-5 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full text-xs font-bold text-white shadow-lg tracking-wide uppercase">
                Most Popular
              </div>
              <div className="p-8 md:p-12 rounded-[22px] bg-slate-950 backdrop-blur-xl h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold mb-2">Pro Plan</h3>
                  <p className="text-slate-400 text-lg">Everything a café needs to succeed.</p>
                </div>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-6xl font-extrabold tracking-tight">₹999</span>
                  <span className="text-slate-400 font-medium text-lg">/month</span>
                </div>
                <ul className="space-y-5 mb-10 flex-1">
                  {[
                    "Unlimited Feedback Submissions",
                    "Unlimited WhatsApp Messaging",
                    "Automated Coupon Generation",
                    "Staff Dashboard Access",
                    "Export Data anytime",
                    "Priority Email Support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-fuchsia-500 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 rounded-xl bg-white text-slate-950 font-bold text-xl hover:bg-slate-200 transition-colors shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]">
                  Get Started Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-violet-900 to-fuchsia-900 relative overflow-hidden shadow-2xl shadow-violet-900/30">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 px-6 py-20 md:py-24 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to transform your <br className="hidden sm:block"/> customer experience?</h2>
            <p className="text-violet-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the smart cafés using Q-Rate Lite to protect their brand and turn every customer into a regular.
            </p>
            <button className="px-10 py-5 rounded-full bg-white text-violet-900 font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 mx-auto">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-6 bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-300 text-base">Q-Rate Lite</span>
          </div>
          <p>© {new Date().getFullYear()} Q-Rate Lite. All rights reserved.</p>
          <div className="flex gap-8 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
