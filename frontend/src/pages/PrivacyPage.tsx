import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] dark:bg-[#030303] text-stone-900 dark:text-zinc-50 font-sans selection:bg-amber-500/30 dark:selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      
      <AnimatedBackground />

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
