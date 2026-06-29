import React, { useState, useEffect } from 'react';
import { ExternalLink, Beaker, Coins, Gamepad2, Layers, ChevronDown, ChevronUp, Lock, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

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
  const [activeGames, setActiveGames] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/active-games')
      .then(res => res.json())
      .then(data => {
        if (data && data.games) {
          setActiveGames(data.games);
        }
      })
      .catch(console.error);
  }, []);

  const currentMonth = new Date().getMonth(); // 0 = Jan ... 5 = Jun, 6 = Jul, 7 = Aug
  
  const isJulyActive = currentMonth === 6;
  const isJulyPast = currentMonth > 6;
  
  const isAugustActive = currentMonth === 7;
  
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 dark:bg-[#0f1117] w-full rounded-2xl p-10 mb-8 text-center flex flex-col items-center border border-slate-200 dark:border-white/10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-blue-500/30 dark:border-blue-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(66,133,244,0.3)] mb-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">🎮 Updated Monthly</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-[#4285F4] to-[#7c3aed] bg-clip-text text-transparent">Arcade</span> Games
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
              Complete these games to earn Arcade Points. 6 new games release every month!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-blue-500 dark:text-blue-400 text-lg">🎮</span> 6 Games/Month
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-amber-500 dark:text-amber-400 text-lg">⏱️</span> Limited Seats
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-green-500 dark:text-green-400 text-lg">⭐</span> 1 Point Each
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#4285F4]/5 border border-[#4285F4]/20 rounded-2xl p-5 md:p-6 mb-10"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-l-4 border-amber-500 pl-4 py-1">
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white mr-2">💡 Recommended:</span>
                  Complete Arcade Games first — they have monthly deadlines. Skill badges can be done anytime.
                </p>
              </div>
              <div className="flex items-start gap-4 border-l-4 border-blue-500 pl-4 py-1">
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white mr-2">📌</span>
                  In 2 months you can earn up to 18 game badges. Any 12 completions count toward Ultimate Milestone.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">July 2026 Games</h3>
              {isJulyActive ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active Now
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  Locked
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-medium">
                August 2026 
                {isAugustActive ? (
                  <span className="text-green-600 dark:text-green-400 ml-1">— Active Now</span>
                ) : (
                  <span className="opacity-70 ml-1">— Coming Soon</span>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {(isJulyActive && activeGames.length > 0 ? activeGames : arcadeGames).map((game, idx) => {
              const titles = ["Arcade Base Camp", "Arcade Adventure", "Arcade Voyage", "Arcade Trail", "Arcade Special Game", "New Arcade Game"];
              const gameName = game.title || titles[idx] || `Game ${idx + 1}`;
              
              if (isJulyActive) {
                return (
                  <motion.div 
                    key={`july-active-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center group hover:border-[#4285F4] dark:hover:border-[#4285F4] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(66,133,244,0.15)] dark:hover:shadow-[0_8px_30px_rgba(66,133,244,0.2)] transition-all duration-300"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#0d1117] flex items-center justify-center mb-6">
                      <img 
                        src={game.img} 
                        alt={gameName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="w-full mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{gameName}</h4>
                        <span className="px-2.5 py-1 rounded bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          ACTIVE
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 mb-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Access Code</p>
                        {arcadeGames[idx]?.code === "Coming Soon!" ? (
                          <p className="text-amber-600 dark:text-amber-400 font-medium">{arcadeGames[idx].code}</p>
                        ) : (
                          <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0f1117] px-3 py-2 rounded-lg border border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/10 transition-colors">
                            <code className="text-green-600 dark:text-green-400 font-mono text-sm">{arcadeGames[idx]?.code || "Coming Soon!"}</code>
                            <button 
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                              onClick={() => navigator.clipboard.writeText(arcadeGames[idx]?.code || "")}
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <a 
                          href={game.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#3367d6] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Start Challenge <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center group transition-all duration-300 opacity-60"
                >
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <Lock className="w-16 h-16 text-slate-400 opacity-80" />
                  </div>
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#0d1117] flex items-center justify-center mb-6">
                    <img 
                      src={game.img} 
                      alt={gameName} 
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  
                  <div className="w-full mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{gameName}</h4>
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">
                        JUL 2026
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Access Code</p>
                      <p className="text-slate-500 font-medium">LOCKED</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              August 2026 {isAugustActive ? "— Active" : "— Locked"}
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isAugustActive && activeGames.length > 0 ? activeGames.map((game, idx) => (
              <motion.div 
                key={`active-${idx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col items-center group hover:border-[#4285F4] dark:hover:border-[#4285F4] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(66,133,244,0.15)] dark:hover:shadow-[0_8px_30px_rgba(66,133,244,0.2)] transition-all duration-300"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#0d1117] flex items-center justify-center mb-6">
                  <img 
                    src={game.img} 
                    alt={game.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="w-full mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{game.title}</h4>
                    <span className="px-2.5 py-1 rounded bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <a 
                      href={game.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#3367d6] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Start Challenge <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )) : [1, 2, 3, 4, 5, 6].map((_, idx) => (
              <motion.div 
                key={`soon-${idx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="bg-slate-50/80 dark:bg-[#1a1d27]/40 border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden opacity-60"
              >
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <Lock className="w-16 h-16 text-slate-400 opacity-80" />
                </div>
                
                <div className="w-full aspect-square bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 mb-6 z-10">
                  <span className="text-xs font-medium text-slate-500">Aug 2026</span>
                </div>

                <div className="w-full mt-auto z-10 text-center">
                  <h4 className="font-medium text-slate-500 dark:text-slate-400 text-lg mb-2">Locked</h4>
                  <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-slate-500 mb-3">
              This month: 6 of 6 games shown · More releasing throughout July
            </p>
            <div className="w-full max-w-md h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Learning Path Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-50 dark:bg-[#0f1117] w-full rounded-2xl p-10 mb-10 text-center flex flex-col items-center border border-slate-200 dark:border-white/10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/50 shadow-sm dark:shadow-[0_0_15px_rgba(251,188,5,0.3)] mb-4">
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">🎯 Learning Paths</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Google Cloud <span className="bg-gradient-to-r from-[#4285F4] to-[#34A853] bg-clip-text text-transparent">Skill</span> Badges
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
            Choose your learning path based on your experience level and master Google Cloud and AI technologies.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="text-blue-500 dark:text-blue-400 text-lg">📈</span> 3 Levels
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="text-amber-500 dark:text-amber-400 text-lg">🏆</span> 51 Badges Total
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="text-green-500 dark:text-green-400 text-lg">⭐</span> 2 Badges = 1 Point
            </div>
          </div>
        </motion.div>

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

