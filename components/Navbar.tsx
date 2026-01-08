
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-6 z-50 px-6 py-3 rounded-full glass-card flex items-center gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-[1.02]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-slow">
          <span className="text-white font-black text-lg">L</span>
        </div>
        <span className="text-white font-poppins font-bold tracking-tight hidden sm:block group-hover:text-indigo-300 transition-colors">FocusBooster</span>
      </Link>

      <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

      {/* Nav Links */}
      <div className="flex items-center gap-2">
        <Link 
          to="/" 
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2
            ${isActive('/') ? 'bg-white text-indigo-900 shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        <Link 
          to="/dashboard" 
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2
            ${isActive('/dashboard') ? 'bg-white text-indigo-900 shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          History
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
