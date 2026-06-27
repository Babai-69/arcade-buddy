import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HelpSupportWidget() {
  return (
    <Link
      to="/support"
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-110 flex items-center justify-center"
      aria-label="Help and Support"
    >
      <MessageSquare className="w-6 h-6" />
    </Link>
  );
}
