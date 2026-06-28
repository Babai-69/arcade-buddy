import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Gift } from 'lucide-react';
import { DeliveryTimelineCard } from '../components/RewardDeliveryCard';

export function SwagsPage() {
  const [activeTier, setActiveTier] = useState('All Tiers');
  const tiers = ['All Tiers', 'Trooper', 'Ranger', 'Champion', 'Legend'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117] font-sans flex flex-col">
      <div className="flex-grow flex flex-col items-center pt-24 pb-12 px-4 max-w-5xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Swag Drops</h1>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto text-[15px]">
          Unlock exclusive Google Cloud Arcade swag by completing challenges and reaching prize tiers.
        </p>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto w-full max-w-3xl border-b border-transparent pb-2 mb-20 scrollbar-hide justify-center">
          {tiers.map(tier => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors shadow-sm ${
                activeTier === tier
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center mt-6 mb-16 max-w-lg mx-auto">
          <div className="text-blue-500 mb-8">
            <Gift className="w-24 h-24 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">No Swag Drops Announced Yet</h2>
          <p className="text-slate-600 dark:text-slate-400 text-[15px] mb-2 leading-relaxed">
            Google Cloud has not officially revealed any Arcade Season 2026 swag rewards yet.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-[15px]">
            Check back later once rewards are announced.
          </p>
        </div>

        {/* Reward Delivery Logistics Poster */}
        <div className="w-full max-w-4xl mx-auto mb-24">
          <DeliveryTimelineCard />
        </div>

        {/* Previous Cohort Swags Gallery */}
        <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-800 pt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Previous Cohort Swags Gallery</h2>
          <p className="text-slate-500 mb-10 text-[15px]">Get inspired by looking at what participants received in previous seasons.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <SwagCard image="https://res.cloudinary.com/dqj9yaa0g/image/upload/v1782036057/WhatsApp_Image_2026-06-21_at_15.30.32_kv5brn.jpg" name="Arcade Trooper" milestone="Milestone 1" color="bg-[#4285F4] text-white" />
            <SwagCard image="https://res.cloudinary.com/dqj9yaa0g/image/upload/v1782036228/WhatsApp_Image_2026-06-02_at_18.59.41_zkfvk2.jpg" name="Arcade Ranger" milestone="Milestone 2" color="bg-[#34A853] text-white" />
            <SwagCard image="https://res.cloudinary.com/dqj9yaa0g/image/upload/v1782036229/WhatsApp_Image_2026-06-02_at_18.58.23_whzljw.jpg" name="Arcade Champion" milestone="Milestone 3" color="bg-[#FBBC05] text-slate-900" />
            <SwagCard image="https://res.cloudinary.com/dqj9yaa0g/image/upload/v1782036230/WhatsApp_Image_2026-06-02_at_18.11.42_lrjq2u.jpg" name="Arcade Legend" milestone="Ultimate Milestone" color="bg-[#EA4335] text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SwagCard({ image, name, milestone, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 text-left group">
      <div className="aspect-square w-full overflow-hidden relative">
        <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold rounded-full z-10 shadow-sm ${color}`}>
          {milestone}
        </div>
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{name}</h3>
        <p className="text-xs text-slate-500">Preview representation</p>
      </div>
    </div>
  );
}
