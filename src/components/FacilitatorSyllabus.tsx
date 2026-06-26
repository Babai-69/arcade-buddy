import React, { useState } from 'react';
import { ExternalLink, Beaker, Coins, Gamepad2, Layers, ChevronDown, ChevronUp } from 'lucide-react';

const arcadeGames = [
  { img: "https://res.cloudinary.com/dqj9yaa0g/image/fetch/f_auto,q_auto,e_make_transparent:10/https://services.google.com/fh/files/misc/gcaf26_adventure_july.png", code: "Coming Soon!" },
  { img: "https://res.cloudinary.com/dqj9yaa0g/image/fetch/f_auto,q_auto,e_make_transparent:10/https://services.google.com/fh/files/misc/gcaf26_voyage_july.png", code: "Coming Soon!" },
  { img: "https://res.cloudinary.com/dqj9yaa0g/image/fetch/f_auto,q_auto,e_make_transparent:10/https://services.google.com/fh/files/misc/gcaf26_trail_july.png", code: "Coming Soon!" },
  { img: "https://res.cloudinary.com/dqj9yaa0g/image/fetch/f_auto,q_auto,e_make_transparent:10/https://services.google.com/fh/files/misc/gcaf26_basecamp_july.png", code: "Coming Soon!" },
  { img: "https://res.cloudinary.com/dqj9yaa0g/image/fetch/f_auto,q_auto,e_make_transparent:10/https://services.google.com/fh/files/misc/gcaf26_special_game_july.png", code: "Coming Soon!" },
  { img: "https://res.cloudinary.com/dqj9yaa0g/image/fetch/f_auto,q_auto,e_make_transparent:10/https://services.google.com/fh/files/misc/gcaf26_new_game_july.png", code: "Coming Soon!" }
];

const beginnerBadges = [
  { title: "Create Your First Gemini Enterprise Application", labs: 1, credits: 0, link: "https://www.skills.google/paths/3546/course_templates/1586" },
  { title: "Develop AI-Powered Prototypes in Google AI Studio", labs: 4, credits: 0, link: "https://www.skills.google/course_templates/1426" },
  { title: "The Basics of Google Cloud Compute", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/754" },
  { title: "Implement Event-Driven Messaging and Automation Workflows", labs: 3, credits: 2, link: "https://www.skills.google/course_templates/728" },
  { title: "Implement Cloud Storage and Data Protection Solutions", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/725" },
  { title: "Create a Streaming Data Lake on Cloud Storage", labs: 4, credits: 3, link: "https://www.skills.google/course_templates/705" },
  { title: "Deploy and Manage Applications on Google App Engine", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/671" },
  { title: "Implement Speech and Language Solutions with Pre-trained APIs", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/700" },
  { title: "Using the Google Cloud Speech API", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/756" },
  { title: "Analyze Speech and Language with Google APIs", labs: 4, credits: 8, link: "https://www.skills.google/course_templates/634" },
  { title: "Store, Process, and Manage Data on Google Cloud - Console", labs: 4, credits: 3, link: "https://www.skills.google/course_templates/658" },
  { title: "Store, Process, and Manage Data on Google Cloud - Command Line", labs: 4, credits: 3, link: "https://www.skills.google/course_templates/659" },
  { title: "Migrate MySQL Data to Cloud SQL Using Database Migration Service", labs: 5, credits: 5, link: "https://www.skills.google/course_templates/629" },
  { title: "Get Started with Sensitive Data Protection", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/750" },
  { title: "Analyze Images with the Cloud Vision API", labs: 4, credits: 12, link: "https://www.skills.google/course_templates/633" },
  { title: "Build Event-Driven Applications with Eventarc", labs: 4, credits: 3, link: "https://www.skills.google/course_templates/727" },
  { title: "Configure Service Accounts and IAM Roles for Google Cloud", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/702" }
];

const intermediateBadges = [
  { title: "Engineer AI Agents with Agent Development Kit (ADK)", labs: 1, credits: 5, link: "https://www.skills.google/course_templates/1596" },
  { title: "Build Real World AI Applications with Gemini and Imagen", labs: 4, credits: 0, link: "https://www.skills.google/course_templates/1076" },
  { title: "Build a Smart Cloud Application with Vibe Coding and MCP", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/1459" },
  { title: "Implement Cloud Collaboration and Productivity Workflows", labs: 7, credits: 0, link: "https://www.skills.google/course_templates/676" },
  { title: "Analyze BigQuery Data in Connected Sheets", labs: 4, credits: 0, link: "https://www.skills.google/course_templates/632" },
  { title: "Streaming Analytics into BigQuery", labs: 4, credits: 2, link: "https://www.skills.google/course_templates/752" },
  { title: "Create a Secure Data Lake on Cloud Storage", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/704" },
  { title: "Secure Lakehouse Data", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/751" },
  { title: "Enrich Metadata and Discovery of Lakehouse Data", labs: 4, credits: 3, link: "https://www.skills.google/course_templates/753" },
  { title: "Monitor and Manage Google Cloud Resources", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/653" },
  { title: "Monitor and Log with Google Cloud Observability", labs: 5, credits: 9, link: "https://www.skills.google/course_templates/749" },
  { title: "Set Up a Google Cloud Network", labs: 4, credits: 8, link: "https://www.skills.google/course_templates/641" },
  { title: "Integrate BigQuery Data and Google Workspace using Apps Script", labs: 4, credits: 2, link: "https://www.skills.google/course_templates/737" },
  { title: "Engineer Data for Predictive Modeling with BigQuery ML", labs: 4, credits: 15, link: "https://www.skills.google/course_templates/627" },
  { title: "Implement DevOps Workflows in Google Cloud", labs: 4, credits: 16, link: "https://www.skills.google/course_templates/716" },
  { title: "Create ML Models with BigQuery ML", labs: 5, credits: 11, link: "https://www.skills.google/course_templates/626" },
  { title: "Build a Website on Google Cloud", labs: 5, credits: 13, link: "https://www.skills.google/course_templates/638" }
];

const advancedBadges = [
  { title: "Explore Generative AI in Agent Platform", labs: 4, credits: 16, link: "https://www.skills.google/course_templates/959" },
  { title: "Implementing Cloud Load Balancing for Compute Engine", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/648" },
  { title: "Prompt Design in Agent Platform", labs: 4, credits: 4, link: "https://www.skills.google/course_templates/976" },
  { title: "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG", labs: 4, credits: 20, link: "https://www.skills.google/course_templates/981" },
  { title: "Develop GenAI Apps with Gemini and Streamlit", labs: 5, credits: 20, link: "https://www.skills.google/course_templates/978" },
  { title: "Set Up an App Dev Environment on Google Cloud", labs: 10, credits: 8, link: "https://www.skills.google/course_templates/637" },
  { title: "Develop Your Google Cloud Network", labs: 6, credits: 18, link: "https://www.skills.google/course_templates/625" },
  { title: "Build a Secure Google Cloud Network", labs: 6, credits: 30, link: "https://www.skills.google/course_templates/654" },
  { title: "Deploy Kubernetes Applications on Google Cloud", labs: 4, credits: 12, link: "https://www.skills.google/course_templates/663" },
  { title: "Derive Insights from BigQuery Data", labs: 7, credits: 6, link: "https://www.skills.google/course_templates/623" },
  { title: "Build LookML Objects in Looker", labs: 5, credits: 0, link: "https://www.skills.google/course_templates/639" },
  { title: "Manage Data Models in Looker", labs: 6, credits: 0, link: "https://www.skills.google/course_templates/651" },
  { title: "Prepare Data for Looker Dashboards and Reports", labs: 5, credits: 0, link: "https://www.skills.google/course_templates/628" },
  { title: "Develop Serverless Apps with Firebase", labs: 4, credits: 16, link: "https://www.skills.google/course_templates/649" },
  { title: "Cloud Architecture: Design, Implement, and Manage", labs: 6, credits: 32, link: "https://www.skills.google/course_templates/640" },
  { title: "Build Global and Regional Load Balancing Solutions", labs: 4, credits: 20, link: "https://www.skills.google/course_templates/1558" },
  { title: "Google DeepMind: Train A Small Language Model", labs: 1, credits: 5, link: "https://www.skills.google/course_templates/1453" }
];

const BadgeCard: React.FC<{ badge: any }> = ({ badge }) => {
  return (
    <div className="bg-transparent rounded-xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col h-full hover:border-slate-300 dark:hover:border-slate-600">
      <div className="p-6 flex-1 flex flex-col">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {badge.title}
        </h4>
        <div className="mt-auto flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Beaker className="w-4 h-4" />
            {badge.labs} Labs
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
            <Coins className="w-4 h-4" />
            {badge.credits} Credits
          </span>
        </div>
      </div>
      <a 
        href={badge.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="px-6 py-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        Open Skill Badge
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

function AccordionSection({ title, isOpen, onToggle, children }: { title: React.ReactNode, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) {
  return (
       <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-800"
      >
        <span className="font-medium text-slate-900 dark:text-white text-lg">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500 shrink-0 ml-4" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 ml-4" />}
      </button>
      {isOpen && (
        <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/50">
          {children}
        </div>
      )}
    </div>
  );
}

export function FacilitatorSyllabus() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Syllabus for the program
          </h1>
        </div>

        {/* Arcade Games Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-[#4285F4]" />
            Arcade Games
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
            <p className="text-lg">
              <strong>Every month we release 6 new Arcade games</strong> that you can complete to earn "Arcade Points" - 1) Arcade Base Camp, 2) Arcade Adventure, 3) Arcade Voyage, 4) Arcade Trail, 5) Arcade Special Game &amp; 6) New Arcade Game (coming soon!).
            </p>
            <p>
              Hence, in a single cohort of 2 months under the Facilitator Program from July - September, you can earn a total of <strong>18 game badges</strong>. See the current active games for this month below. We will update these as and when new games will be released in the following months. <strong>Note:</strong> Games have limited seats, so enrol and complete them ASAP.
            </p>
            <br />
            <p>
              <strong>Note:</strong> While there are a total of 6 games that are released every month and you can complete 18 games in total in the 2 months of the facilitator program, any 12 game completions will be counted towards the ultimate milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {arcadeGames.map((game, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img 
                  src={game.img} 
                  alt={`Arcade Game ${idx + 1}`} 
                  className="w-full max-w-[280px] h-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                />
                <div className="mt-6 text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Access Code:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{game.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
            🎯 Google Cloud Skill Badges 🎯
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Choose your learning path based on your experience level and master Google Cloud and AI technologies while earning skill badges.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-10">
          
          <AccordionSection 
            title="Beginner: Get Started with Google Cloud & AI (17 Skill Badges)"
            isOpen={openSections.includes('beginner')}
            onToggle={() => toggleSection('beginner')}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
                Perfect for newcomers starting their Google Cloud and AI journey. These skill badges introduce cloud fundamentals, AI tools, storage, networking, databases, and application deployment.
              </p>
              <div className="shrink-0 inline-flex flex-wrap items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">65 Labs</span>
                <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">67 Credits</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beginnerBadges.map((badge, idx) => (
                <BadgeCard key={idx} badge={badge} />
              ))}
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Intermediate: Dive Deeper into Google Cloud & AI (17 Skill Badges)"
            isOpen={openSections.includes('intermediate')}
            onToggle={() => toggleSection('intermediate')}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
                Build production-ready cloud solutions while exploring AI applications, observability, networking, security, data engineering, DevOps, and machine learning.
              </p>
              <div className="shrink-0 inline-flex flex-wrap items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">71 Labs</span>
                <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">100 Credits</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {intermediateBadges.map((badge, idx) => (
                <BadgeCard key={idx} badge={badge} />
              ))}
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Advanced: Take your Google Cloud & AI Skills to Next Level (17 Skill Badges)"
            isOpen={openSections.includes('advanced')}
            onToggle={() => toggleSection('advanced')}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
                Master advanced cloud architecture, networking, Kubernetes, GenAI applications, Looker analytics, Firebase, multimodal AI, and enterprise-scale cloud solutions.
              </p>
              <div className="shrink-0 inline-flex flex-wrap items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">89 Labs</span>
                <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm">211 Credits</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advancedBadges.map((badge, idx) => (
                <BadgeCard key={idx} badge={badge} />
              ))}
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Looking for more Skill Badges?"
            isOpen={openSections.includes('more')}
            onToggle={() => toggleSection('more')}
          >
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
              Since, we only have a list of 51 skill badges here, in order to earn the ultimate milestone, you will have to search for 15 more skill badges and complete them from our <a href="https://docs.google.com/spreadsheets/d/19Eql1t6lbqZQAzL2URepijHp7cdiTW1JHQTtt-mLsdc/edit?gid=678806814#gid=678806814" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">catalog here</a>.
            </p>
          </AccordionSection>

        </div>

      </div>
    </section>
  );
}

