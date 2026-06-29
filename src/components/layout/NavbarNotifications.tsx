import React, { useState, useRef, useEffect } from 'react';
import { Bell, ExternalLink, Pin, RefreshCw, X, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  date?: string;
  description: string;
  linkText: string;
  linkUrl: string;
  pinned?: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 'sub',
    title: 'Subscribe to The Arcade',
    description: 'Subscription to the Arcade is necessary to receive important email updates and perks. However, you can unsubscribe anytime you want.',
    linkText: 'Subscribe Here',
    linkUrl: 'https://forms.gle/2h6xCvY3sW29pw4p7',
    pinned: true,
  },
  {
    id: 'infocus-june',
    title: 'InFocus This Week: Google Skills Arcade June 2026',
    date: '15 June 2026',
    description: 'The Google Skills Arcade Team has kicked off June with three brand-new games designed to help learners build practical cloud skills across application development, AI, security, data engineering, and ...',
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/infocus-this-week-google-skills-arcade-june-2026',
  },
  {
    id: 'tiers-june',
    title: 'Google Skills Arcade 2026 Tiers',
    date: '10 June 2026',
    description: 'Google Skills Arcade 2026 Prize Tiers have officially been announced, giving learners a clear roadmap to plan their journey throughout the year. This season introduces two major changes: the Novice Ti...',
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/google-skills-arcade-2026-tiers',
  },
  {
    id: 'direct-access',
    title: "Can't get into the Arcade? No worries—here is your direct access pass!",
    date: '8 June 2026',
    description: "The Google Skills Arcade website is currently undergoing maintenance, so if you're unable to access it today, there's no need to worry—it isn't an issue on your side. While the site is temporarily una...",
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/cant-get-into-the-arcade-no-worries-here-is-your-direct-access-pass',
  },
  {
    id: 'coming-soon-tiers',
    title: 'Coming Soon: Google Skills Arcade 2026 Tiers',
    date: '30 May 2026',
    description: 'The Google Skills Arcade team has shared an early preview of upcoming changes to the 2026 Prize Counter, with the full Prize Tier announcement scheduled for next week. Based on community feedback, the...',
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/coming-soon-google-skills-arcade-2026-tiers',
  },
  {
    id: 'work-meets-play',
    title: 'InFocus This Week: Work Meets Play and Skill Up Summer',
    date: '21 May 2026',
    description: 'This week\'s Google Skills Arcade focuses on practical, hands-on cloud skills that help you understand how modern applications are built, secured, and scaled in real-world environments. The Work Meets ...',
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/infocus-this-week-work-meets-play-and-skill-up-summer',
  },
  {
    id: 'level-up-twice',
    title: 'Level Up Twice: Pro-Tip to Score Big in the Google Skills Arcade and Validate Your Skills',
    date: '7 May 2026',
    description: 'Did you know that the labs you complete in the Google Skills Arcade can also help you earn official Google Cloud Skill Badges? Many of this month\'s Arcade games are directly connected to recognized cl...',
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/level-up-twice-pro-tip-to-score-big-in-the-google-skills-arcade-and-validate-your-skills',
  },
  {
    id: 'clarification',
    title: 'Clarification: Your 2026 Arcade Points & The Prize Counter',
    date: '24 April 2026',
    description: 'Google has clarified that all the Arcade Points you\'ve earned throughout 2026 are completely safe and will be fully counted when the Prize Counter opens later this year, meaning whether you started ea...',
    linkText: 'View Post',
    linkUrl: 'https://discuss.google.dev/t/clarification-your-2026-arcade-points-the-prize-counter',
  },
];

export function NavbarNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isFetching, setIsFetching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('readNotifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      if (prev.includes(id)) return prev;
      const newIds = [...prev, id];
      localStorage.setItem('readNotifications', JSON.stringify(newIds));
      return newIds;
    });
  };

  const markAllAsRead = () => {
    setReadIds(prev => {
      const newIds = Array.from(new Set([...prev, ...notifications.map(n => n.id)]));
      localStorage.setItem('readNotifications', JSON.stringify(newIds));
      return newIds;
    });
  };

  const unreadNotifications = notifications.filter(n => !readIds.includes(n.id));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLatestNotifications = async () => {
    setIsFetching(true);
    try {
      // Using allorigins to bypass CORS for client-side fetching from Discourse
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://discuss.google.dev/c/learning/320.json')}`);
      const data = await response.json();
      const parsedData = JSON.parse(data.contents);
      
      if (parsedData && parsedData.topic_list && parsedData.topic_list.topics) {
        const fetchedTopics = parsedData.topic_list.topics.slice(0, 10).map((topic: any) => {
          const date = new Date(topic.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          return {
            id: `topic-${topic.id}`,
            title: topic.title,
            date: date,
            description: topic.excerpt || 'Read the full post for more details on this topic from the community.',
            linkText: 'View Post',
            linkUrl: `https://discuss.google.dev/t/${topic.slug}/${topic.id}`,
          };
        });

        // Merge fetched topics with pinned/existing ones, avoiding duplicates by title
        setNotifications(prev => {
          const newNotifs = [...prev];
          fetchedTopics.forEach((ft: Notification) => {
            if (!newNotifs.some(n => n.title === ft.title)) {
              newNotifs.splice(1, 0, ft); // Insert right after pinned item
            } else {
              // Update existing link if matched by title
              const existingIdx = newNotifs.findIndex(n => n.title === ft.title);
              if (existingIdx !== -1) {
                newNotifs[existingIdx].linkUrl = ft.linkUrl;
              }
            }
          });
          return newNotifs;
        });
      }
    } catch (error) {
      console.warn('Failed to fetch notifications, using default static notifications.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLatestNotifications();
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen max-w-sm sm:max-w-md bg-[#1a1d27] border border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-[#1a1d27]">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" /> Notifications ({unreadNotifications.length})
            </h3>
            <div className="flex items-center gap-2">
              {unreadNotifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={fetchLatestNotifications}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Refresh notifications"
                disabled={isFetching}
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
              <Link 
                to="/swags" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Swag Drops <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 bg-[#11131a]">
            {unreadNotifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                You're all caught up!
              </div>
            ) : (
              unreadNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-xl border ${notif.pinned ? 'border-red-500/50 bg-[#1a1d27]' : 'border-slate-700 bg-[#1a1d27]'} flex flex-col gap-2`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-white font-bold text-sm leading-snug">{notif.title}</h4>
                    <div className="flex items-center gap-3">
                      {notif.pinned ? (
                        <Pin className="w-4 h-4 text-red-500 shrink-0" />
                      ) : notif.date ? (
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 font-medium">{notif.date}</span>
                      ) : null}
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="text-slate-500 hover:text-white transition-colors shrink-0"
                        title="Mark as read"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {notif.description}
                  </p>
                  
                  <a 
                    href={notif.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${notif.pinned ? 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md w-max' : 'text-blue-400 hover:text-blue-300 w-max'}`}
                  >
                    {notif.linkText} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
