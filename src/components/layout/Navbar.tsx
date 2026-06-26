import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/images/regenerated_image_1782145505916.png';

import { NavbarUserMenu } from './NavbarUserMenu';

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Ensure dark mode is permanently disabled
    document.documentElement.classList.remove('dark');
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Facilitator Program', path: '/facilitator' },
    { name: 'Syllabus', path: '/syllabus' },
    { name: 'Resources', path: '/resources' },
    { name: 'Swags', path: '/swags' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed w-full z-50 glass-card border-b-0 backdrop-blur-xl bg-white/60 dark:bg-slate-950/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImage} alt="Google Cloud" className="w-[43px] h-[37px] object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-[#4285F4] ml-1">Arcade Buddy</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#4285F4]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#4285F4]'
                  }`}
                >
                  {link.name}
                </Link>
            ))}
            <Link to="/dashboard#calculator" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full font-bold transition-all shadow-md">
              Calculator
            </Link>
            <NavbarUserMenu />
          </div>
          <div className="md:hidden flex items-center gap-4">
            <NavbarUserMenu />
            <button 
              className="p-2 text-slate-800 dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl absolute w-full left-0 top-16">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-[#4285F4] bg-blue-50 dark:bg-blue-900/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <Link to="/dashboard#calculator" className="block text-center w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl font-bold transition-all shadow-md">
                Calculator
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
