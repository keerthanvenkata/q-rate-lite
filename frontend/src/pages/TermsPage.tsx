import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] dark:bg-[#030303] text-stone-900 dark:text-zinc-50 font-sans selection:bg-amber-500/30 dark:selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
      
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto bg-[#FFFDF8]/80 dark:bg-[#0A0A0A] backdrop-blur-xl border border-amber-200/50 dark:border-white/5 shadow-2xl shadow-amber-900/5 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-400"></div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-stone-900 dark:text-white tracking-tight">Terms of Service</h1>
            <div className="prose prose-stone dark:prose-invert max-w-none text-stone-700 dark:text-zinc-300 space-y-6">
              <p className="font-medium text-stone-500 dark:text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
              
              <p className="text-lg leading-relaxed">Welcome to Q-Rate Lite, a service engineered by TinKern Labs. By accessing or using our application, you agree to be bound by these Terms of Service. These terms govern your use of the Q-Rate Lite web application and WhatsApp-integrated services.</p>
              
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">By accessing or using Q-Rate Lite, you (the "Café Owner" or "Customer") agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service or use our APIs.</p>
              
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">2. Description of Service</h2>
              <p className="leading-relaxed">Q-Rate Lite provides a WhatsApp-integrated feedback management system specifically tailored for independent cafés and high-volume restaurants. The service includes capturing customer feedback, managing reward coupons autonomously via the Meta WhatsApp Cloud API, and providing an administrative dashboard.</p>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">3. WhatsApp API Usage & Anti-Spam Policy</h2>
              <p className="leading-relaxed">As a customer of Q-Rate Lite, you are strictly bound by the <a href="https://business.whatsapp.com/policy" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-indigo-400 hover:underline">WhatsApp Business Policy</a> and <a href="https://www.whatsapp.com/legal/business-terms/" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-indigo-400 hover:underline">WhatsApp Commerce Policy</a>.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You agree to only send marketing or promotional messages to customers who have explicitly opted-in via the Q-Rate Lite feedback form.</li>
                <li>You acknowledge that violating the WhatsApp anti-spam policies may result in immediate suspension or termination of your Meta API connection, for which Q-Rate Lite bears no liability.</li>
                <li>You agree to indemnify and hold harmless TinKern Labs against any claims arising from your misuse of customer phone numbers or violations of local telemarketing regulations.</li>
              </ul>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">4. Subscriptions and Recurring Payments</h2>
              <p className="leading-relaxed">The Q-Rate Lite Pro License is billed on a recurring monthly or annual basis via Razorpay. By providing a payment method, you authorize us to charge the applicable subscription fees on a recurring basis until canceled.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Cancellations:</strong> Subscriptions can be canceled at any time through the Billing section of the dashboard or by contacting support.</li>
                <li><strong>Refunds:</strong> There are no refunds or credits for partial months of service following a cancellation. Your service will remain active until the end of the current billing period.</li>
              </ul>

              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-10 mb-4">5. Limitation of Liability</h2>
              <p className="leading-relaxed">To the maximum extent permitted by law, TinKern Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or reputation, resulting from your use of the Q-Rate Lite service, misconfiguration, or any downtime experienced by third-party providers (e.g., Meta WhatsApp Cloud API, Supabase, Razorpay, or Vercel).</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-amber-200/60 dark:border-white/5 py-12 px-6 mt-auto">
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
    </div>
  );
}
