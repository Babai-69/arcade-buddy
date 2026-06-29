import React from 'react';
import { Award, CheckCircle2, Info } from 'lucide-react';

const milestones = [
  {
    id: 1,
    title: "Milestone 1",
    games: 6,
    badges: 18,
    gamePoints: 6,
    badgePoints: 9,
    bonusPoints: 5,
    totalArcadePoints: 15,
    note: (
      <>
        On completion of Milestone 1, you become eligible to take part in the "Bonus Milestone". You can complete the same to earn an extra 10 bonus points, thus making your total, 15 + 5 + 10 = 30 points.
      </>
    )
  },
  {
    id: 2,
    title: "Milestone 2",
    games: 8,
    badges: 34,
    gamePoints: 8,
    badgePoints: 17,
    bonusPoints: 15,
    totalArcadePoints: 25,
    note: (
      <>
        If you complete the "Bonus Milestone" along with Milestone 2, you can earn an extra 10 bonus points, thus making your total, 25 + 15 + 10 = 50 points.
      </>
    )
  },
  {
    id: 3,
    title: "Milestone 3",
    games: 10,
    badges: 50,
    gamePoints: 10,
    badgePoints: 25,
    bonusPoints: 25,
    totalArcadePoints: 35,
    note: (
      <>
        If you complete the "Bonus Milestone" along with Milestone 3, you can earn an extra 10 bonus points, thus making your total, 35 + 25 + 10 = 70 points.
      </>
    )
  },
  {
    id: 4,
    title: "Ultimate Milestone",
    games: 12,
    badges: 66,
    gamePoints: 12,
    badgePoints: 33,
    bonusPoints: 35,
    totalArcadePoints: 45,
    note: (
      <>
        If you complete the "Bonus Milestone" along with Ultimate Milestone, you can earn an extra 10 bonus points, thus making your total, 45 + 35 + 10 = 90 points.
      </>
    )
  }
];

export function FacilitatorBonus() {
  return (
    <section id="point-system" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-slate-900 dark:text-white text-center">
          See the milestones of the program below!
          </h2>
        {/* Bonus Milestone Banner */}
        <div className="mb-10 bg-[#f8f7ff] dark:bg-purple-900/10 border border-[#e5e0ff] dark:border-purple-500/20 rounded-2xl p-6 sm:p-8 flex gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-white dark:bg-purple-900/30 border border-[#e5e0ff] dark:border-purple-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Introducing the Bonus Milestone 🏆
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#f0ebff] dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
                Coming Soon
              </span>
            </div>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                For the first time ever, there is more than one way to earn <span className="font-bold text-purple-600 dark:text-purple-400">"Bonus Points"</span> in the Arcade Facilitator program and this time we want to make sure that you actually step away with some industry-ready skills after completing this.
              </p>
              <p>
                More details about the new <span className="font-bold text-purple-600 dark:text-purple-400">"Bonus Milestone"</span>, its eligibility criteria and how will you be able to earn an extra <span className="font-bold">10 Bonus Points</span> will be posted here soon.
              </p>
              <p className="text-purple-600 dark:text-purple-400 font-medium">
                So please stay tuned and keep an eye out here! 🥽
              </p>
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((m) => (
            <div 
              key={m.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🏆 {m.title}
                </h3>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium uppercase tracking-wide text-sm">
                    ANY {m.games} Arcade Games
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 font-medium uppercase tracking-wide text-sm">
                    ANY {m.badges} Skill Badges
                  </span>
                </div>
              </div>

              <div className="bg-[#f8faff] dark:bg-slate-900/50 rounded-xl border border-blue-100 dark:border-slate-700/50 mb-6 overflow-hidden">
                <div className="px-4 py-3 border-b border-blue-100 dark:border-slate-700/50">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    POINTS BREAKDOWN
                  </span>
                </div>
                <div className="p-4 space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{m.games} Games</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{m.gamePoints} Points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{m.badges} Skill Badges</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{m.badgePoints} Points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Milestone Completion</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{m.bonusPoints} Bonus Points</span>
                  </div>
                  <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">Total 🌟</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">
                      {m.totalArcadePoints} Arcade Points + {m.bonusPoints} Bonus Points
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 flex gap-3 border border-blue-100 dark:border-blue-900/30">
                  <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {m.note}
                  </p>
                </div>
                
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic px-1">
                  * You will only receive bonus points for the milestone that you earn and not for the ones before that.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
