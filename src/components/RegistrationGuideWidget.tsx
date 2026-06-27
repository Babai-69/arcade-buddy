import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function RegistrationGuideWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Use the preview URL instead of edit URL for cleaner display
  const docUrl = "https://docs.google.com/document/d/1paUrRhgYKV8v1Slsnn1XIBdlQcxfQCL-loyqgNntvD4/preview";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Registration Guide"
      >
        <BookOpen className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out pl-0 group-hover:pl-2 font-medium">
          Registration Guide
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Registration Guide</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 w-full relative bg-slate-100 dark:bg-slate-950">
                {/* Loader placeholder behind iframe */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Loading document...</p>
                  </div>
                </div>
                
                <iframe
                  src={docUrl}
                  className="absolute inset-0 w-full h-full border-0 relative z-10 bg-white"
                  title="Registration Guide Document"
                  allow="autoplay; fullscreen"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
