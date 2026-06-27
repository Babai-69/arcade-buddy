import React from 'react';
import { Send, MessageCircle } from 'lucide-react';

export function Community() {
  return (
    <section className="py-8 bg-slate-900 border-y border-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-display font-bold mb-4 flex items-center justify-center gap-3">
          🤝 Join Our Community
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Connect with others, ask questions, and stay updated in our Telegram and WhatsApp communities.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="https://t.me/arcadebuddy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#4285F4] hover:bg-blue-600 transition-colors px-6 py-4 rounded-xl shadow-lg flex-1 sm:max-w-[280px]"
          >
            <div className="bg-white/10 p-3 rounded-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Telegram Community</div>
              <div className="text-blue-100 text-sm">Click to join</div>
            </div>
          </a>

          <a
            href="https://chat.whatsapp.com/JRvoPJxMibzLPnqWcASG0I"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#0F9D58] hover:bg-[#0b8549] transition-colors px-6 py-4 rounded-xl shadow-lg flex-1 sm:max-w-[280px]"
          >
            <div className="bg-white/10 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">WhatsApp Community</div>
              <div className="text-green-100 text-sm">Click to join</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
