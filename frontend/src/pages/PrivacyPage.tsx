import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] dark:bg-[#030303] text-stone-900 dark:text-zinc-50 font-sans selection:bg-amber-500/30 dark:selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      
      {/* Authentic Dark Mode Curved Aurora Ribbons & Noise Background */}
      <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none bg-[#020617] overflow-hidden">
        {/* Far Layer: Deep Haze */}
        <div className="absolute inset-0 bg-slate-950/80 blur-[50px]"></div>

        {/* Mid Layer: Curved Hollow Ellipse Ribbons */}
        <div className="absolute inset-0 opacity-80 mix-blend-screen" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)', maskImage: 'linear-gradient(to bottom, black 30%, transparent 90%)' }}>
          <div className="absolute top-[-60%] left-[-20%] w-[150vw] h-[120vh] border-[60px] border-emerald-500/25 rounded-[100%] blur-[40px] animate-[ribbon-wave-1_25s_ease-in-out_infinite]"></div>
          <div className="absolute top-[-50%] left-[-10%] w-[140vw] h-[130vh] border-[40px] border-teal-400/20 rounded-[100%] blur-[50px] animate-[ribbon-wave-2_30s_ease-in-out_infinite]"></div>
          <div className="absolute top-[-70%] left-[0%] w-[160vw] h-[150vh] border-[80px] border-indigo-500/20 rounded-[100%] blur-[60px] animate-[ribbon-wave-3_35s_ease-in-out_infinite]"></div>
        </div>

        {/* Focal Bloom */}
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[50%] h-[30%] rounded-[100%] bg-indigo-400/5 blur-[100px]"></div>
        
        {/* Animated Film Grain */}
        <div className="absolute inset-[-10%] opacity-[0.04] mix-blend-screen animate-noise-shift" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
      
      {/* Light Mode Papyrus Background (Sweeping Ink Washes & God Rays) */}
      <div className="dark:hidden fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#FAF3E0]">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vh] bg-amber-400/15 blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vh] bg-orange-600/10 blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute top-[-50%] left-[-20%] w-[150vw] h-[120vh] border-[80px] border-amber-700/5 rounded-[100%] blur-[40px] animate-[papyrus-dune-1_30s_ease-in-out_infinite] will-change-transform"></div>
        <div className="absolute bottom-[-60%] right-[-10%] w-[140vw] h-[130vh] border-[60px] border-orange-800/5 rounded-[100%] blur-[50px] animate-[papyrus-dune-2_35s_ease-in-out_infinite] will-change-transform"></div>
        <div className="absolute top-[-50%] left-[30%] w-[40vw] h-[200vh] bg-gradient-to-r from-transparent via-amber-100/40 to-transparent blur-[60px] mix-blend-overlay animate-[papyrus-ray_25s_ease-in-out_infinite] will-change-transform"></div>
        <div className="absolute inset-0 opacity-[0.35] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto bg-[#FFFDF8]/80 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-2xl shadow-amber-900/5 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-400"></div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-stone-900 dark:text-white tracking-tight">Privacy Policy</h1>
            <div className="prose prose-stone dark:prose-invert max-w-none text-stone-700 dark:text-zinc-300 space-y-6">
              <p className="font-medium text-stone-500 dark:text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
              
              <p className="text-lg leading-relaxed">At Q-Rate Lite (a product of TinKern Labs), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect the information of our B2B customers (Café Owners) and their end-users (Café Customers).</p>
              
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">1. Information We Collect</h2>
              <p>When providing our WhatsApp-first feedback system, we process the following data:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Customer Feedback:</strong> Star ratings, text comments, and timestamps provided voluntarily via our web application by café customers.</li>
                <li><strong>Phone Numbers (via WhatsApp):</strong> We temporarily process customer phone numbers strictly for issuing unique discount coupons and facilitating communication initiated via the Meta Cloud API.</li>
                <li><strong>Café Owner Data:</strong> Account information, dashboard analytics, and subscription details necessary to provide the service.</li>
              </ul>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">2. Usage of WhatsApp and Phone Numbers</h2>
              <p className="leading-relaxed">Q-Rate Lite integrates with the Meta WhatsApp Cloud API. We enforce a strict <strong>no-spam policy</strong>. Phone numbers collected are used solely to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Send the immediate requested feedback link or coupon (transactional messaging).</li>
                <li>Deliver marketing messages <strong>only if</strong> the customer explicitly opted-in via the feedback form. Café owners are strictly prohibited from messaging users who have not opted in.</li>
              </ul>
              <p className="leading-relaxed mt-4">We do not sell, rent, or share phone numbers with any third-party marketing services.</p>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">3. Payment Processing</h2>
              <p className="leading-relaxed">Subscription payments are processed securely via <strong>Razorpay</strong>. Q-Rate Lite does not store or process complete credit card numbers, UPI IDs, or banking details on our servers. We only store the Razorpay Customer ID, Subscription ID, and billing status required to maintain access to the service.</p>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">4. Data Security & Retention</h2>
              <p className="leading-relaxed">We use industry-standard security measures, including managed PostgreSQL databases and secure serverless hosting. Data is retained only for as long as necessary to provide the service to the café. If a café cancels their subscription, associated end-user data may be anonymized or deleted in accordance with our data lifecycle policies.</p>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">5. Contact Us</h2>
              <p className="leading-relaxed">If you have any questions about this Privacy Policy, your data rights, or how we handle your data, please contact our privacy team at <strong>privacy@qrate.tinkernlabs.com</strong>.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-amber-200/60 dark:border-white/5 py-12 px-6 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-500 dark:text-zinc-500">
            <Logo />
            <p>© {new Date().getFullYear()} TinKern Labs. All rights reserved.</p>
            <div className="flex gap-8 font-medium">
              <Link to="/terms" className="hover:text-stone-900 dark:hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-stone-900 dark:hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
