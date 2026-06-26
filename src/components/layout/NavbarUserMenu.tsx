import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChartBar, Settings } from 'lucide-react';
import { auth, loginWithGoogle, logout } from '../../lib/firebase';
import { ensureUserExists } from '../../lib/userProgressService';
import { onAuthStateChanged } from 'firebase/auth';

export function NavbarUserMenu() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await ensureUserExists(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/my-progress');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        alert('Login popup was blocked or cancelled. Please allow popups for this site or open the app in a new tab to sign in.');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  if (!user) {
    return (
      <button 
        onClick={handleLogin}
        className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
        title="Sign In with Google to Track Progress"
      >
        <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </button>
    );
  }

  const isAdmin = user.email === 'deya58690@gmail.com';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full focus:outline-none ring-2 ring-transparent hover:ring-blue-400 transition-all"
      >
        <img 
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} 
          alt="User Profile" 
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
        />
        {/* Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user.displayName || 'Student'}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/my-progress');
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
            >
              <ChartBar className="w-4 h-4 text-blue-500" />
              My Progress
            </button>
            
            {isAdmin && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin-progress');
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
              >
                <Settings className="w-4 h-4 text-purple-500" />
                Admin: All Students
              </button>
            )}
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
