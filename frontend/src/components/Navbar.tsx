import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { session, signOut } = useAuth();

  return (
    <>
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-xl bg-[#FAF3E0]/70 dark:bg-zinc-950/60 border-b border-amber-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-zinc-300">
            {isLandingPage ? (
              <>
                <a href="#how-it-works" className="hover:text-stone-900 dark:hover:text-white transition-colors">How it Works</a>
                <a href="#features" className="hover:text-stone-900 dark:hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="hover:text-stone-900 dark:hover:text-white transition-colors">Pricing</a>
              </>
            ) : (
              <>
                <Link to="/#how-it-works" className="hover:text-stone-900 dark:hover:text-white transition-colors">How it Works</Link>
                <Link to="/#features" className="hover:text-stone-900 dark:hover:text-white transition-colors">Features</Link>
                <Link to="/#pricing" className="hover:text-stone-900 dark:hover:text-white transition-colors">Pricing</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-amber-100/50 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-zinc-400 focus:outline-none"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {session ? (
              <>
                <Link to="/sudo" className="text-sm font-medium text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={signOut}
                  className="bg-stone-900 dark:bg-white text-[#FFFCF8] dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-stone-900 dark:bg-white text-[#FFFCF8] dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-stone-500 dark:text-zinc-400">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 text-stone-600 dark:text-zinc-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FFFCF8] dark:bg-zinc-950 pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            {isLandingPage ? (
              <>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">How it Works</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">Features</a>
                <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">Pricing</a>
              </>
            ) : (
              <>
                <Link to="/#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">How it Works</Link>
                <Link to="/#features" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">Features</Link>
                <Link to="/#pricing" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">Pricing</Link>
              </>
            )}
            {session ? (
              <>
                <Link to="/sudo" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">Dashboard</Link>
                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-left text-stone-600 dark:text-zinc-300">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300">Login</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-stone-600 dark:text-zinc-300 font-bold">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
