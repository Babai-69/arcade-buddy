import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

const milestones = [
  {
    id: 1,
    title: "Milestone 1",
    subtitle: "Complete ANY 6 Arcade Games & 18 Skill Badges",
    details: [
      "For 6 games = 6 Points",
      "For 18 skill badges = 9 Points",
      "For milestone completion = 5 Bonus Points",
    ],
    highlightPoints: "15 Arcade Points + 5 Bonus Points ⭐️",
    totalPoints: "Total: 20 Points",
    note: (
      <>
        Note: On completion of Milestone 1, you become eligible to take part in the "<a href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Bonus Milestone</a>". You can complete the same to earn an extra 10 bonus points, thus making your total, 15 + 5 + 10 = 30 points.
      </>
    ),
    footerText: "*You will only receive bonus points for the milestone that you earn and not for the ones before that."
  },
  {
    id: 2,
    title: "Milestone 2",
    subtitle: "Complete ANY 8 Arcade Games & 34 Skill Badges",
    details: [
      "For 8 games = 8 Points",
      "For 34 skill badges = 17 Points",
      "For milestone completion = 15 Bonus Points",
    ],
    highlightPoints: "25 Arcade Points + 15 Bonus Points ⭐️",
    totalPoints: "Total: 40 Points",
    note: (
      <>
        Note: If you complete the "<a href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Bonus Milestone</a>" along with Milestone 2, you can earn an extra 10 bonus points, thus making your total, 25 + 15 + 10 = 50 points.
      </>
    ),
    footerText: "*You will only receive bonus points for the milestone that you earn and not for the ones before that."
  },
  {
    id: 3,
    title: "Milestone 3",
    subtitle: "Complete ANY 10 Arcade Games & 50 Skill Badges",
    details: [
      "For 10 games = 10 Points",
      "For 50 skill badges = 25 Points",
      "For milestone completion = 25 Bonus Points",
    ],
    highlightPoints: "35 Arcade Points + 25 Bonus Points ⭐️",
    totalPoints: "Total: 60 Points",
    note: (
      <>
        Note: If you complete the "<a href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Bonus Milestone</a>" along with Milestone 3, you can earn an extra 10 bonus points, thus making your total, 35 + 25 + 10 = 70 points.
      </>
    ),
    footerText: "*You will only receive bonus points for the milestone that you earn and not for the ones before that."
  },
  {
    id: 4,
    title: "Ultimate Milestone",
    subtitle: "Complete ANY 12 Arcade Games & 66 Skill Badges",
    details: [
      "For 12 games = 12 Points",
      "For 66 skill badges = 33 Points",
      "For milestone completion = 35 Bonus Points",
    ],
    highlightPoints: "45 Arcade Points + 35 Bonus Points ⭐️",
    totalPoints: "Total: 80 Points",
    note: (
      <>
        Note: If you complete the "<a href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Bonus Milestone</a>" along with Ultimate Milestone, you can earn an extra 10 bonus points, thus making your total, 45 + 35 + 10 = 90 points.
      </>
    ),
    footerText: "*You will only receive bonus points for the milestone that you earn and not for the ones before that."
  }
];

export function FacilitatorBonus() {
  return (
    <section id="point-system" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-slate-900 dark:text-white text-center">
          See the milestones of the program below!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((m) => (
            <div 
              key={m.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col shadow-sm"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {m.title}
                </h3>
              </div>
              
              <ul className="space-y-2 mb-6">
                {m.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 mb-4" />
                
                <div className="mb-2">
                  <div className="text-blue-500 dark:text-blue-400 font-bold text-sm mb-0.5">
                    {m.highlightPoints}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {m.totalPoints}
                  </div>
                </div>

                {m.note && (
                  <div className="mt-4 bg-slate-50/50 dark:bg-white/5 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/5">
                    {m.note}
                  </div>
                )}
                {m.footerText && (
                  <div className="mt-3 text-[10px] text-slate-500 italic">
                    {m.footerText}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
