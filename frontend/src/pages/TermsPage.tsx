import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF8] dark:bg-zinc-950 text-stone-900 dark:text-zinc-50 font-sans flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-3xl mx-auto mt-12 mb-24 p-8 md:p-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-none border border-amber-100 dark:border-zinc-800">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-stone-900 dark:text-white tracking-tight">Terms of Service</h1>
          <div className="prose prose-stone dark:prose-invert max-w-none text-stone-700 dark:text-zinc-300 space-y-6">
            <p className="font-medium text-stone-500 dark:text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
            <p className="text-lg leading-relaxed">Welcome to Q-Rate Lite, a service engineered by TinKern Labs. By accessing or using our application, you agree to be bound by these Terms of Service.</p>
            
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">By accessing or using Q-Rate Lite, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service or use our APIs.</p>
            
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">2. Description of Service</h2>
            <p className="leading-relaxed">Q-Rate Lite provides a WhatsApp-integrated feedback management system specifically tailored for independent cafés and high-volume restaurants. The service includes capturing customer feedback, managing reward coupons autonomously, and providing an administrative dashboard.</p>

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">3. User Responsibilities</h2>
            <p className="leading-relaxed">Café owners agree to use the service in compliance with all applicable laws, including data protection regulations regarding customer outreach. You are responsible for safeguarding your administrative passcode and ensuring that your staff uses the system appropriately. Abuse of the WhatsApp API through our service may result in immediate termination.</p>

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">4. Subscriptions and Payments</h2>
            <p className="leading-relaxed">The Pro License is billed on a flat monthly rate. Subscriptions can be canceled at any time through the Super Admin dashboard or by contacting support. There are no refunds for partial months of service following a cancellation.</p>

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">5. Limitation of Liability</h2>
            <p className="leading-relaxed">TinKern Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits or data, resulting from your use of the Q-Rate Lite service or any downtime experienced by third-party providers (e.g., Meta WhatsApp Cloud API).</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-amber-200/60 dark:border-white/5 py-12 px-6 bg-[#FAF3E0] dark:bg-zinc-950 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-500 dark:text-zinc-500">
          <Logo />
          <p>© {new Date().getFullYear()} TinKern Labs. All rights reserved.</p>
          <div className="flex gap-8 font-medium">
            <Link to="/privacy" className="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-stone-900 dark:hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
