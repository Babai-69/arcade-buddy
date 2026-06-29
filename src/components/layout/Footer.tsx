import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, BookOpen, Star, HelpCircle, Gamepad2, Cloud, Shield, Instagram, Github, Linkedin } from 'lucide-react';
import footerLogo from '../../assets/images/regenerated_image_1782574219934.png';

export function Footer() {
  const buildDate = new Date(typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now());
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(buildDate);
  const formattedTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(buildDate);

  return (
    <footer className="glass-card mt-24 border-t dark:border-slate-800 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={footerLogo} alt="Google Cloud" className="w-[30px] h-[26px] object-contain" />
              <span className="font-display font-bold text-lg">Google Cloud Arcade Buddy</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Master Cloud Skills. Earn Badges & Bonus Points. Unlock Exclusive Google Cloud Rewards through the Facilitator Program 2026.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.instagram.com/dey_babai001/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://github.com/Arcade-With-Us/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/abir-dey-a34914254/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://t.me/arcadebuddy" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/facilitator" className="flex items-center gap-2 hover:text-[#4285F4]"><BookOpen className="w-4 h-4 text-[#4285F4]"/> About Program</Link></li>
              <li><Link to="/leaderboard" className="flex items-center gap-2 hover:text-[#4285F4]"><Star className="w-4 h-4 text-[#FBBC04]"/> Leaderboard</Link></li>
              <li><Link to="/syllabus" className="flex items-center gap-2 hover:text-[#4285F4]"><BookOpen className="w-4 h-4 text-[#34A853]"/> Syllabus</Link></li>
              <li><a href="/facilitator#point-system" className="flex items-center gap-2 hover:text-[#4285F4]"><Star className="w-4 h-4 text-[#EA4335]"/> Points System</a></li>
              <li><Link to="/faq" className="flex items-center gap-2 hover:text-[#4285F4]"><HelpCircle className="w-4 h-4 text-[#4285F4]"/> FAQs</Link></li>
              <li><a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4285F4]"><Gamepad2 className="w-4 h-4 text-[#34A853]"/> Official Arcade</a></li>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#4285F4]"><Shield className="w-4 h-4 text-[#EA4335]"/> Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Community</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://t.me/arcadebuddy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#4285F4] transition-colors">
                  <Send className="h-4 w-4 text-[#4285F4]" /> Telegram Group
                </a>
              </li>
              <li>
                <a href="https://chat.whatsapp.com/JRvoPJxMibzLPnqWcASG0I" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#34A853] transition-colors">
                  <MessageCircle className="h-4 w-4 text-[#34A853]" /> WhatsApp Channel
                </a>
              </li>
              <li>
                <a href="https://discuss.google.dev/tag/learning" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#EA4335] transition-colors">
                  <Cloud className="h-4 w-4 text-[#EA4335]" /> GDG Announcements
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col items-center justify-between text-sm text-slate-500">
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4 md:mb-0 gap-4">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <p>© 2026 Arcade. All rights reserved.</p>
              <p className="text-xs text-slate-400">Last Updated: {formattedDate} at {formattedTime} IST</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
              <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Terms</Link>
              <Link to="/code-of-conduct" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Code of Conduct</Link>
              <Link to="/program-tncs" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Program TnCs</Link>
            </div>
          </div>
          <p className="mt-6 md:mt-4 font-medium text-center w-full border-t border-slate-200 dark:border-slate-800 pt-6">
            Made with ❤️ by <a href="https://www.linkedin.com/in/abir-dey-a34914254/" target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:text-[#4285F4] transition-colors underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">Abir Dey</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
