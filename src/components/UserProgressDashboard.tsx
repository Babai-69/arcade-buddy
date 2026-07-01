import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, ExternalLink, Download, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { SKILL_BADGES, GAME_BADGES } from '../lib/badgeLinks';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useArcadeGames } from '../utils/arcadeApi';

export function UserProgressDashboard() {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  
  const { activeGames } = useArcadeGames();
  
  useEffect(() => {
    // Left intentionally blank as requested
  }, []);

  const fetchProgress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profileUrl) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/calculator?url=${encodeURIComponent(profileUrl)}`);
      if (!res.ok) throw new Error("Could not fetch profile. Ensure your profile is public.");
      
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error fetching progress');
    } finally {
      setLoading(false);
    }
  };

  const gamesToTrack = activeGames.length > 0 ? activeGames : Object.entries(GAME_BADGES).map(([title, link]) => ({ title, link }));

  const downloadPDF = () => {
    if (!data) return;
    
    const doc = new jsPDF();
    const studentName = auth.currentUser?.displayName || data.name || 'Student';
    const dateStr = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.text('Google Cloud Arcade Progress Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Student: ${studentName}`, 14, 32);
    if (auth.currentUser?.email) doc.text(`Email: ${auth.currentUser.email}`, 14, 38);
    doc.text(`Date: ${dateStr}`, 14, 44);

    let completedGameBadges = 0;
    let completedSkillBadges = 0;
    
    const tableData: any[] = [];
    
    // Process Game Badges
    gamesToTrack.forEach(game => {
      const isCompleted = data.badges.some((b: any) => b.title.toLowerCase().includes(game.title.toLowerCase()));
      if (isCompleted) completedGameBadges++;
      tableData.push([
        game.title,
        'Game Badge',
        isCompleted ? 'Completed' : 'Not Touched',
        isCompleted ? 'Yes' : '-'
      ]);
    });
    
    // Process Skill Badges
    Object.keys(SKILL_BADGES).forEach(badgeName => {
      const isCompleted = data.badges.some((b: any) => b.title.toLowerCase() === badgeName.toLowerCase());
      if (isCompleted) completedSkillBadges++;
      tableData.push([
        badgeName,
        'Skill Badge',
        isCompleted ? 'Completed' : 'Not Touched',
        isCompleted ? 'Yes' : '-'
      ]);
    });

    doc.text(`Game Badges Completed: ${completedGameBadges} / ${gamesToTrack.length}`, 14, 54);
    doc.text(`Skill Badges Completed: ${completedSkillBadges} / ${Object.keys(SKILL_BADGES).length}`, 14, 60);

    autoTable(doc, {
      startY: 68,
      head: [['Badge Name', 'Type', 'Status', 'In Timeline']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`Arcade_Progress_${studentName.replace(/\s+/g, '_')}.pdf`);
  };

  if (!auth.currentUser) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-24 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Please Sign In</h2>
        <p className="text-slate-500">You need to sign in to view your progress tracker.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-8 pb-20 px-4 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          My Progress Tracker
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Enter your Google Cloud public profile URL. We will automatically fetch your game and skill badges completed between July 13th 5:30 PM and September 14th 11:59 PM.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
        <form onSubmit={fetchProgress} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Public Profile URL</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://www.skills.google/public_profiles/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>
          <div className="sm:self-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Check Progress'}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {data && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              {data.avatarUrl && (
                <img src={data.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700" />
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{data.name || 'Profile'}</h2>
                <div className="text-sm font-medium text-slate-500 flex gap-4 mt-1">
                  <span>🎯 Game Badges: {data.gameBadges}</span>
                  <span>🏆 Skill Badges: {data.skillBadges}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#34A853] hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Progress
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Game Badges Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                🎮 Game Badges
              </h3>
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {gamesToTrack.map(game => {
                  const isCompleted = data.badges.some((b: any) => b.title.toLowerCase().includes(game.title.toLowerCase()));
                  return (
                    <div key={game.title} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div>
                        <a href={game.link} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors group">
                          {game.title}
                          <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                        </a>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Not Earned
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skill Badges Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                🏆 Skill Badges
              </h3>
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                {Object.entries(SKILL_BADGES).map(([badgeName, url]) => {
                  const isCompleted = data.badges.some((b: any) => b.title.toLowerCase() === badgeName.toLowerCase());
                  return (
                    <div key={badgeName} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors group truncate w-full">
                          <span className="truncate">{badgeName}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
                        </a>
                      </div>
                      <div className="shrink-0 pt-0.5 ml-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Not Earned
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
