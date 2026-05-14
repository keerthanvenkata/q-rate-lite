import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF8] dark:bg-zinc-950 text-stone-900 dark:text-zinc-50 font-sans flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-grow">
        <div className="max-w-3xl mx-auto mt-12 mb-24 p-8 md:p-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-none border border-amber-100 dark:border-zinc-800">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-stone-900 dark:text-white tracking-tight">Privacy Policy</h1>
          <div className="prose prose-stone dark:prose-invert max-w-none text-stone-700 dark:text-zinc-300 space-y-6">
            <p className="font-medium text-stone-500 dark:text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
            <p className="text-lg leading-relaxed">At Q-Rate Lite (a product of TinKern Labs), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect the information of our users and the customers of the independent cafés using our service.</p>
            
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">1. Information We Collect</h2>
            <p>We collect information when you use our WhatsApp-first feedback system:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Customer Feedback:</strong> Star ratings, text comments, and timestamps provided voluntarily via our web app.</li>
              <li><strong>Phone Numbers:</strong> To prevent spam and issue unique discount coupons, we temporarily process customer phone numbers via the Meta WhatsApp API.</li>
              <li><strong>Café Data:</strong> Account information, passcode, and basic analytics needed to operate the service.</li>
            </ul>

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">2. How We Use Information</h2>
            <p className="leading-relaxed">The data collected is used strictly to provide the Q-Rate Lite service. Feedback is routed directly to the café owner's dashboard. We do not sell your personal data to third parties. Customer phone numbers are only used to issue coupons and, if explicitly opted-in, for marketing messages initiated by the café owner.</p>

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">3. Data Security</h2>
            <p className="leading-relaxed">We use industry-standard security measures, including Vercel serverless infrastructure and secure database hosting, to protect your data. Audit logs are maintained immutably for security purposes to ensure the integrity of the system.</p>

            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">4. Contact Us</h2>
            <p className="leading-relaxed">If you have any questions about this Privacy Policy or how we handle your data, please contact our privacy team at <strong>privacy@qrate.tinkernlabs.com</strong>.</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-amber-200/60 dark:border-white/5 py-12 px-6 bg-[#FAF3E0] dark:bg-zinc-950 mt-auto">
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
  );
}
