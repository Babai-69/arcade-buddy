import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqsCol1 = [
  {
    id: "c1_1",
    question: "What is the eligibility criteria for enrolling in the program?",
    answer: (
      <div className="space-y-2">
        <p>You need to meet these requirements if you want enrol in the program:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You need to have access to a working internet connection & a laptop with latest chrome browser.</li>
          <li>You need to be above 18 years of age.</li>
          <li>You must have been referred by any of the "Facilitators" that are part of the program or should get auto assigned to a "Facilitator Team" once enrolled.</li>
          <li>You are part of the countries supported under the Google Skills Terms of Service.</li>
        </ul>
      </div>
    )
  },
  {
    id: "c1_2",
    question: "The enrolment form is closed. How should I enrol in the program?",
    answer: (
      <div className="space-y-2">
        <p>Each cohort has limited seats. If the enrolment form is closed, then it means that the seats of that cohort has been filled and thus we request you to please wait for the next cohort to start to enrol in the program.</p>
        <p>Keep an eye out on the home page of the site for the new cohort start dates.</p>
      </div>
    )
  },
  {
    id: "c1_3",
    question: "I did not receive an invitation email after applying through the enrolment form. What should I do?",
    answer: (
      <div className="space-y-2">
        <p>Here's what you can do:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Please wait for 24-48 hours after filling the form and you will surely receive your email</li>
          <li>Check for the email under your SPAM/JUNK/PROMOTIONS folder.</li>
          <li>Just reach out to your Facilitators and they will help you get the instructions and enrol you in the program.</li>
        </ul>
      </div>
    )
  },
  {
    id: "c1_4",
    question: "I need to make some changes to the my registration details in the enrolment form, but it's closed now? What should I do?",
    answer: (
      <div className="space-y-2">
        <p>Note that while the enrolment form will remain open throughout your cohort, if its has been closed, that means that the seats in the program are now full and we DO NOT allow changes to be made to the enrolment form once its closed.</p>
        <p>Though you can still reach out to your "Facilitators" and share the correct information with them. They can share that information with us and we can then decide to update the details or not based on the type of request. Note: Email Id changes are NOT allowed once the enrolment form has been closed.</p>
      </div>
    )
  },
  {
    id: "c1_5",
    question: "The links are not working in my enrolment email. What should I do?",
    answer: "Sometimes due to how you have setup your email inbox, the links in the enrolment email might come out to be broken. Please do not worry about this. You can just copy and paste the hardcoded URLs in your browser added beside each link in the email and those should work too."
  },
  {
    id: "c1_6",
    question: "I have more questions about the Google Skills Arcade, where can I find them?",
    answer: (
      <p>
        You can check out the FAQs section on the Google Skills Arcade main website here - <a href="https://go.cloudskillsboost.google/arcade" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://go.cloudskillsboost.google/arcade</a>. Just scroll down to the bottom of the page.
      </p>
    )
  }
];

const faqsCol2 = [
  {
    id: "c2_1",
    question: "If I have already participated in last year's cohort of the program, can I participate in this year's cohort as well?",
    answer: "Yes, you CAN. We motivate you that you participate in the program using the same email address that you used last time so that your progress can move forward with you as you progress in this year's cohort."
  },
  {
    id: "c2_2",
    question: "Are users who participated/are participating in any other cloud campaigns or Arcade individually eligible for the program?",
    answer: (
      <div className="space-y-2">
        <p>Yes! You can participate in the program as long as your badge completions are on or after 13th July 2026 i.e. the start date of the program.</p>
        <p className="italic text-sm">Note: Anyone participating in the Arcade Facilitator Indonesia 2026 cohort is NOT eligible to participate in the Arcade Facilitator India Cohort and vice-a-versa.</p>
      </div>
    )
  },
  {
    id: "c2_3",
    question: "I have already completed the skill badges/games in the program, what should I do?",
    answer: "Please note that in order to get the prizes, you need to complete the skill badges/games on or after 13th July 2026 and before the end date of the program. Any badges completed before or after that won't be counted. If you want, you can make a new account on Google Skills with a new email ID and enrol in the program using that email ID instead."
  },
  {
    id: "c2_4",
    question: "I am a part of a Google Cloud Partner organisation or am currently doing specific skill badges which are specifically assigned to my organisation and not available in the public GCSB catalog? Can I participate in the program?",
    answer: (
      <div className="space-y-2">
        <p>Please note that you can certainly participate in the program at your own personal capacity and we recommend that you join the program using your personal email IDs instead of organisational email Ids.</p>
        <p>Also, since Arcade Facilitator program is a public campaign and we DO NOT partner with any institutions/organisations, we do not track badge completions which are NOT part of the Google Skills public catalog here.</p>
      </div>
    )
  },
  {
    id: "c2_5",
    question: "I have achieved all the milestones in the program. Will I get the Bonus Points associated with each of them?",
    answer: "Please note that we will evaluate your progress at the end of your cohort and you will only get the bonus points for the milestone that you achieve & not for the ones before that."
  },
  {
    id: "c2_6",
    question: "I have completed few/all of the milestones. When will I get my prizes?",
    answer: "If you have completed any of the milestones mentioned in the Points System section and have acquired enough Arcade Points for redemption, then you will need to wait until the Arcade Prize Counter opens up in January 2027. You will be able to redeem your points on the counter then. Until then, we motivate you to keep completing more badges to acquire more points."
  },
  {
    id: "c2_7",
    question: "Where will the schwags be delivered - to my address ?",
    answer: "You will be asked to enter your preferred address at the time of prize redemption and your claimed schwags will be delivered there. It usually takes 8-12 weeks for the prizes to be shipped after you place the order."
  },
  {
    id: "c2_8",
    question: "Is my country eligible for shipping prizes?",
    answer: "We make every effort to reach you wherever you are, whenever possible. Items cannot be shipped to countries on the list of US Treasury Department’s Sanctions Programs and the following countries: Pakistan, Bangladesh, Iraq, Iran, North Korea, Crimea, Cuba, Sevastopol city and Syria. Each challenge includes details about prizes and shipping availability, as this list may change at any time (locations may be added or removed based on unforeseen events). If you’re in one of these countries, you are welcome to participate within the Terms of Service. You may decline a prize or select an address in a country where shipping is available. (Though re-routing of swags to any country mentioned above would be against our terms of service)"
  },
  {
    id: "c2_9",
    question: "Will users receive any certificate after completing any milestone in the program?",
    answer: "Note that as part of the program users will get digital badges from Google on their Google Skills profile once they complete a game or a trivia or a skill badge or a lab-free course. There are no separate certificates for the participating users."
  }
];

export function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  const renderFAQ = (faq: { id: string, question: string, answer: React.ReactNode }) => (
    <div key={faq.id} className="border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm overflow-hidden text-left hover:bg-white/60 dark:hover:bg-slate-900/50 transition-colors duration-300">
      <button 
        onClick={() => toggle(faq.id)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3 pr-4">
          <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">?</div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{faq.question}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {openId === faq.id && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-slate-600 dark:text-slate-400 text-sm pl-14">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-20 px-4">
      <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 mb-4 border border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-6 h-6 text-[#8b5cf6]" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">Find answers to common queries about the program, rewards, and eligibility</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-4">
            {faqsCol1.map(renderFAQ)}
          </div>
          <div className="space-y-4">
            {faqsCol2.map(renderFAQ)}
          </div>
        </div>
      </div>
    </div>
  );
}
