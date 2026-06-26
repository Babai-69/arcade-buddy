import React from 'react';
import { ExternalLink, ShieldAlert, Cloud, Code, GitMerge, FileText, Gift, Award, Zap, Terminal, Database, Shield } from 'lucide-react';
import { FacilitatorCards } from '../components/FacilitatorCards';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans flex flex-col font-medium">
      <div className="flex-grow flex flex-col items-center pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        
        {/* Important Note */}
        <div className="bg-amber-50/80 border border-amber-200/50 rounded-2xl p-6 mb-16 max-w-4xl w-full text-left">
          <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold">
            <ShieldAlert className="w-5 h-5 text-blue-500" /> Important Note
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Although this site offers details about The Arcade, please note that our <a href="https://arcade-buddy.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold hover:underline cursor-pointer">Google Cloud Arcade Buddy</a> is an independent, unofficial tool and has no connection to or endorsement from Google. For accurate and official information about the Arcade program, including any support needs, please use the official resources listed above or reach out to Google Skills support directly via email: <a href="mailto:support-skills@google.com" className="text-blue-500 underline">support-skills@google.com</a>.
          </p>
        </div>

        {/* Section 1 */}
        <div className="w-full text-center mb-16">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8">What is Google Cloud Arcade?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={GitMerge} title="Gamified Learning" desc="Structured challenges that make cloud learning engaging." />
            <FeatureCard icon={FileText} title="Monthly Challenges" desc="New labs and challenges released regularly." />
            <FeatureCard icon={Terminal} title="Hands-on Labs" desc="Practice real-world Google Cloud scenarios." />
            <FeatureCard icon={Gift} title="Completely Free" desc="Accessible to everyone with no participation cost." />
          </div>
        </div>

        {/* Section 2 */}
        <div className="w-full text-center mb-16">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8">Skills You Will Build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard icon={Shield} title="Generative AI" desc="Hands-on with Gemini, Vertex AI, and GenAI workflows." />
            <FeatureCard icon={Cloud} title="Cloud Fundamentals" desc="BigQuery, Kubernetes, Firebase, networking, and security." />
            <FeatureCard icon={Zap} title="Prompt Engineering" desc="Design prompts to maximize AI outputs." />
            <FeatureCard icon={Database} title="Practical Experience" desc="Real labs to solidify learning through practice." />
          </div>
        </div>

        {/* Section 3 */}
        <div className="w-full text-center mb-16">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8">How Arcade Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard icon={FileText} title="Choose Challenges" desc="Select labs based on your interests." />
            <FeatureCard icon={Award} title="Earn Points" desc="Complete labs to earn points and badges." />
            <FeatureCard icon={Gift} title="Progress & Rewards" desc="Level up and unlock Arcade swags." />
          </div>
        </div>

        {/* Section 4 */}
        <div className="w-full text-center mb-16">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8">About Google Cloud Arcade Buddy</h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-left shadow-sm max-w-4xl mx-auto">
             <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold">
               <Cloud className="w-5 h-5 text-blue-500" /> Arcade Buddy Platform
             </div>
             <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
               Google Cloud Arcade Buddy is a community-driven learning platform built to support Google Cloud Arcade participants. It helps learners track progress, understand lab workflows, explore Arcade programs, and stay updated with challenges, points, and rewards — all in one place.
             </p>
          </div>
        </div>

        {/* Developer Profile */}
        <div className="w-full max-w-5xl mx-auto mb-16">
           <FacilitatorCards />
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
       <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-white font-bold text-[15px]">
         <Icon className="w-4 h-4 text-blue-500" /> {title}
       </div>
       <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
         {desc}
       </p>
    </div>
  );
}

function LinkCard({ title, sub, href }: any) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="bg-[#f8f9fc] hover:bg-[#f0f4ff] transition-colors rounded-xl p-3 flex justify-between items-center group border border-transparent hover:border-blue-100">
      <div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</div>
        <div className="text-sm font-semibold text-slate-900">{sub}</div>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
    </a>
  );
}
