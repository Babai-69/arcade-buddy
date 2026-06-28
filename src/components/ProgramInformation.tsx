import React, { useState, useEffect } from 'react';
import { Calendar, Clock, PlayCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

export function ProgramInformation() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLive, setIsLive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Target date: July 13, 2026 17:00:00 GMT+0530 (IST) -> 11:30:00Z
    const targetDate = new Date('2026-07-13T11:30:00Z').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        setIsLive(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Google Cloud Arcade 2026 Program Information</h2>
        <p className="text-sm text-slate-500">Our arcade points calculator is specifically designed for the 2026 Google Cloud Arcade program.</p>
      </div>

      {/* What's Changing Section */}
      <div className="bg-white dark:bg-slate-900 border border-[#b2dbfb] dark:border-blue-900/50 rounded-2xl p-6 md:p-8 shadow-sm">
         <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-4">What's Changing in the Arcade</h3>
         <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
           At Google Skills Arcade, the best learning happens when you have space to build, experiment, make mistakes, and truly understand how things work. The 2026 updates lean further into that hands-on philosophy so learners can focus on practical, career-ready skills at their own pace.
         </p>
         <ul className="space-y-3">
           <li className="flex items-start gap-3">
             <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4285F4] flex-shrink-0" />
             <p className="text-sm text-slate-600 dark:text-slate-400">Google Skills Arcade Sprints and Certification Zone are being sunset so the focus stays on deeper hands-on learning.</p>
           </li>
           <li className="flex items-start gap-3">
             <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4285F4] flex-shrink-0" />
             <p className="text-sm text-slate-600 dark:text-slate-400">The number of labs per game is being reduced to give learners more time to explore, experiment, and build confidence.</p>
           </li>
           <li className="flex items-start gap-3">
             <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4285F4] flex-shrink-0" />
             <p className="text-sm text-slate-600 dark:text-slate-400">Every game will now be worth 1 Arcade point, creating a more balanced reward system across cloud, data, and AI journeys.</p>
           </li>
           <li className="flex items-start gap-3">
             <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4285F4] flex-shrink-0" />
             <p className="text-sm text-slate-600 dark:text-slate-400">Arcade Facilitators are coming soon to help with guidance, support, and practical direction whenever learners get stuck.</p>
           </li>
           <li className="flex items-start gap-3">
             <div className="w-2 h-2 mt-1.5 rounded-full bg-[#4285F4] flex-shrink-0" />
             <p className="text-sm text-slate-600 dark:text-slate-400">New Arcade tiers and an updated Prize Counter are on the way, with the path to top tiers still designed to stay clear and achievable.</p>
           </li>
         </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Important Program Dates + Video */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-blue-600">
            <Calendar className="w-5 h-5 text-[#4285F4]" />
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Program Important Information</h3>
          </div>
          
          <div className="space-y-6">
            {/* The YouTube Video Replaces the timeline section here */}
            {isPlaying ? (
               <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
                 <iframe 
                   className="w-full h-full"
                   src="https://www.youtube.com/embed/UEiw3fJ1xKI?autoplay=1" 
                   title="YouTube video player" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                   referrerPolicy="strict-origin-when-cross-origin" 
                   allowFullScreen>
                 </iframe>
               </div>
            ) : (
               <div 
                 onClick={() => setIsPlaying(true)}
                 className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer relative group bg-slate-100 flex items-center justify-center"
               >
                 <img src="https://res.cloudinary.com/dqj9yaa0g/image/upload/v1782035047/Skill_Badge_wokmgx.png" alt="How to Enable CHECK MY PROGRESS" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                 <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center transition-colors group-hover:bg-black/30">
                   <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-xl rounded-full" />
                   <div className="mt-4 bg-white/90 px-4 py-2 rounded-full shadow-lg">
                      <p className="text-xs font-bold text-slate-900">Click to watch</p>
                   </div>
                 </div>
               </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h4 className="font-bold text-sm font-display text-slate-800 dark:text-slate-200">
                  {isLive ? 'Facilitator Program Status:' : 'Facilitator Program Starts In:'}
                </h4>
              </div>

              {isLive ? (
                <div className="text-center py-4 bg-[#34A853]/10 border border-[#34A853]/20 rounded-xl">
                   <span className="text-xl font-bold text-[#34A853] flex items-center justify-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse"></span>
                     PROGRAM IS LIVE
                   </span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-2xl font-bold font-display text-[#4285F4]">{timeLeft.days}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">DAYS</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-2xl font-bold font-display text-[#4285F4]">{timeLeft.hours}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">HOURS</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-2xl font-bold font-display text-[#4285F4]">{timeLeft.minutes}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">MINUTES</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-2xl font-bold font-display text-[#4285F4]">{timeLeft.seconds}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">SECONDS</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Arcade Points System */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
           <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white text-center mb-6">Arcade Points System</h3>
           
           <div className="space-y-3">
              <PointRow icon="🚀" name="Arcade Adventure" points="1 pt each" color="bg-[#8b5cf6]" />
              <PointRow icon="🚢" name="Arcade Voyage" points="1 pt each" color="bg-[#0ea5e9]" />
              <PointRow icon="🧭" name="Arcade Trail" points="1 pt each" color="bg-[#8b5cf6]" />
              <PointRow icon="👑" name="Arcade Special" points="X pt each" color="bg-[#f43f5e]" />
              <PointRow icon="⚡" name="Base Camp" points="1 pt each" color="bg-[#f97316]" />
              <PointRow icon="🛠️" name="Skill Badge" points="0.5 pt each" color="bg-[#22c55e]" />
              <PointRow icon="🏆" name="Facilitator Milestones" points="Bonus pts" color="bg-[#0ea5e9]" />
           </div>
        </div>
      </div>
    </div>
  );
}

function PointRow({ icon, name, points, color }: { icon: string, name: string, points: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{name}</span>
      </div>
      <div className={`${color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
        {points}
      </div>
    </div>
  );
}
