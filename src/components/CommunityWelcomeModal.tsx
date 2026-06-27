import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';

export function CommunityWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('communityWelcomeDismissed');
    if (dismissed) {
      if (dismissed === 'true') {
        return;
      }
      const dismissedUntil = parseInt(dismissed, 10);
      if (!isNaN(dismissedUntil) && Date.now() < dismissedUntil) {
        return;
      }
    }
    
    // Show modal after a short delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem('communityWelcomeDismissed', 'true');
    setIsOpen(false);
  };

  const handleRemindLater = () => {
    const nextWeek = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('communityWelcomeDismissed', nextWeek.toString());
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#111622] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-800"
          >
            <div className="p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6 mt-2">
                <h2 className="text-xl font-bold text-white mb-2">Facilitator Program '26 - Opening Soon</h2>
                <p className="text-slate-400 text-sm">Get instant program updates on WhatsApp</p>
              </div>

              {/* Channel Card */}
              <div className="border border-green-600/50 rounded-xl p-4 mb-6 bg-green-900/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#25D366] p-2 rounded-lg text-white shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-bold">WhatsApp Channel</div>
                      <div className="text-[#25D366] text-xs font-medium">Quick Updates Only</div>
                    </div>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg shrink-0">
                    <QRCodeSVG 
                      value="https://whatsapp.com/channel/0029VaFls0z6WaKl79w42K1N"
                      size={64}
                      level="Q"
                      imageSettings={{
                        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
                        x: undefined,
                        y: undefined,
                        height: 16,
                        width: 16,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>
                <a
                  href="https://whatsapp.com/channel/0029VaFls0z6WaKl79w42K1N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1fae53] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Follow Channel
                </a>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-800 flex-1"></div>
                <div className="text-slate-400 text-xs font-medium">Join Community</div>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              {/* Group Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href="https://chat.whatsapp.com/JRvoPJxMibzLPnqWcASG0I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1da851] hover:bg-[#188c43] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Group
                </a>
                <a
                  href="https://t.me/arcadebuddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Send className="w-5 h-5" />
                  Telegram Group
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDontShowAgain}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
                >
                  Don't Show Again
                </button>
                <button
                  onClick={handleRemindLater}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
                >
                  Remind Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
