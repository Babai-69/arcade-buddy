import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Award, Sparkles, ChevronRight, Users, Activity, TrendingUp, Clock, Instagram, Github, Linkedin } from 'lucide-react';
import { Participant } from '../types';

export function Hero({ participants }: { participants: Participant[] }) {
  const safeParticipants = participants || [];
  const totalParticipants = safeParticipants.length;
  const totalPoints = safeParticipants.reduce((sum, p) => sum + p.arcadePoints, 0);
  const activeToday = safeParticipants.filter(p => p.arcadePoints > 0).length;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLive, setIsLive] = useState(false);

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
    <section className="relative pt-20 pb-10 overflow-hidden" id="about">
      {/* Floating left social bar */}
      <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        <a href="https://www.instagram.com/dey_babai001/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-500 hover:text-pink-600 hover:-translate-y-1 transition-all duration-300 group">
          <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
        <a href="https://github.com/Arcade-With-Us/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:-translate-y-1 transition-all duration-300 group">
          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
        <a href="https://www.linkedin.com/in/abir-dey-a34914254/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-500 hover:text-[#0a66c2] hover:-translate-y-1 transition-all duration-300 group">
          <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!isLive && (
            <div style={{
              position: 'relative',
              borderRadius: '999px',
              padding: '2px',
              display: 'inline-flex',
              marginBottom: '24px'
            }}>
              <div style={{
                position: 'absolute', inset: '-2px',
                borderRadius: '999px', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '200%', height: '200%',
                  top: '-50%', left: '-50%',
                  background: 'conic-gradient(from 0deg, transparent 0%, #4285F4 25%, #EA4335 50%, #FBBC05 75%, #34A853 100%)',
                  animation: 'spinCW 3s linear infinite'
                }}/>
              </div>
              <div 
                className="bg-white dark:bg-[#0f1117]"
                style={{
                  position: 'relative',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  zIndex: 1
                }}
              >
                <span style={{
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: '#34A853',
                  display: 'inline-block',
                  flexShrink: 0,
                  animation: 'pulse 2.5s ease-in-out infinite'
                }}/>
                <span className="text-[13px] text-slate-800 dark:text-white/85 whitespace-nowrap">
                  Arcade 2026 is starting soon — get ready!
                </span>
                <a href="/leaderboard" style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#FBBC05',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                  Start tracking →
                </a>
              </div>
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Google Cloud <span className="text-gradient-google">Arcade Buddy</span>
            <br />
            <span className="text-3xl md:text-5xl text-slate-700 dark:text-slate-300 mt-2 block">
              Facilitator Program 2026
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed tracking-wide">
            Master Cloud Skills. Earn Badges & Bonus Points. Unlock Exclusive Google Cloud Rewards right to your doorstep.
          </p>
          
          <div className="flex lg:hidden justify-center gap-4 mb-10">
            <a href="https://www.instagram.com/dey_babai001/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-pink-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://github.com/Arcade-With-Us/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/abir-dey-a34914254/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-[#0a66c2] transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="/#register" className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg">
              Join the Program <ChevronRight className="h-5 w-5" />
            </a>
            <a href="/leaderboard" className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-full font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              <Award className="h-5 w-5 text-[#FBBC05]" /> View Leaderboard
            </a>
          </div>

          {!isLive && (
            <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <h4 className="font-bold font-display text-slate-800 dark:text-slate-200">
                  Facilitator Program Starts In:
                </h4>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="text-3xl lg:text-4xl font-bold font-display text-[#4285F4] mb-1">{timeLeft.days}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">DAYS</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="text-3xl lg:text-4xl font-bold font-display text-[#4285F4] mb-1">{timeLeft.hours}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">HOURS</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="text-3xl lg:text-4xl font-bold font-display text-[#4285F4] mb-1">{timeLeft.minutes}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">MINUTES</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="text-3xl lg:text-4xl font-bold font-display text-[#4285F4] mb-1">{timeLeft.seconds}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">SECONDS</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8"
        >
          {[
            { icon: Cloud, color: 'text-[#4285F4]', bg: 'bg-[#4285F4]/10', title: 'Learn Cloud Tech', desc: 'Complete hands-on labs and skill badges on Cloud Skills Boost.' },
            { icon: Sparkles, color: 'text-[#FBBC05]', bg: 'bg-[#FBBC05]/10', title: 'Earn Points', desc: 'Every badge earns you Arcade Points. Climb the leaderboard daily.' },
            { icon: Award, color: 'text-[#34A853]', bg: 'bg-[#34A853]/10', title: 'Unlock Swag', desc: 'Reach milestones to claim exclusive Google Cloud merchandise.' }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl text-left border border-white/50 dark:border-slate-800 backdrop-blur-xl">
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
