import React, { useState, useEffect } from 'react';
import { UserBadgeProgress, getUserProgress, updateBadgeStatus } from '../lib/userProgressService';
import { Search, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { auth } from '../lib/firebase';

export function UserProgressDashboard() {
  const [badges, setBadges] = useState<UserBadgeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Sorting & Pagination
  const [sortKey, setSortKey] = useState<keyof UserBadgeProgress>('difficultyLevel');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  const categories = ['All', 'AI', 'APIs', 'Analytics', 'Application Development', 'Data', 'DevOps', 'Infrastructure', 'Security', 'Networking'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Advanced'];
  
  const DIFF_WEIGHTS: Record<string, number> = {
    'Easy': 1,
    'Medium': 2,
    'Hard': 3,
    'Advanced': 4,
  };
  
  const CAT_COLORS: Record<string, { bg: string, text: string }> = {
    'AI': { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400' },
    'Analytics': { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
    'Application Development': { bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-600 dark:text-teal-400' },
    'Data': { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400' },
    'DevOps': { bg: 'bg-pink-500/10 dark:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400' },
    'Infrastructure': { bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-400' },
    'Security': { bg: 'bg-red-500/10 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400' },
    'Networking': { bg: 'bg-yellow-500/10 dark:bg-yellow-500/20', text: 'text-yellow-600 dark:text-yellow-400' },
    'APIs': { bg: 'bg-green-500/10 dark:bg-green-500/20', text: 'text-green-600 dark:text-green-400' },
  };

  const DIFF_COLORS: Record<string, { bg: string, text: string }> = {
    'Easy': { bg: 'bg-green-500/10 dark:bg-green-500/20', text: 'text-green-600 dark:text-green-400' },
    'Medium': { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
    'Hard': { bg: 'bg-red-500/10 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400' },
    'Advanced': { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400' },
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadProgress(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadProgress = async (uid: string) => {
    try {
      const data = await getUserProgress(uid);
      setBadges(data);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (badgeId: string, newStatus: any) => {
    if (!auth.currentUser) return;
    
    const badge = badges.find(b => b.id === badgeId);
    let completionDate = badge?.completionDate;
    
    if (newStatus === 'Completed') {
      completionDate = completionDate || new Date().toISOString().split('T')[0];
    } else {
      completionDate = null;
    }

    try {
      await updateBadgeStatus(auth.currentUser.uid, badgeId, { status: newStatus, completionDate });
      
      setBadges(badges.map(b => 
        b.id === badgeId ? { ...b, status: newStatus, completionDate } : b
      ));

      showToast('Saved to Firestore');
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDateChange = async (badgeId: string, date: string) => {
    if (!auth.currentUser) return;
    try {
      await updateBadgeStatus(auth.currentUser.uid, badgeId, { completionDate: date });
      setBadges(badges.map(b => b.id === badgeId ? { ...b, completionDate: date } : b));
      showToast('Date updated');
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleSort = (key: keyof UserBadgeProgress) => {
    if (sortKey === key) {
      setSortDir(sortDir === 1 ? -1 : 1);
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading your progress...</div>;
  }

  if (!auth.currentUser) {
    return (
      <div className="w-full max-w-7xl mx-auto pt-24 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Please Sign In</h2>
        <p className="text-slate-500">You need to sign in to view your progress tracker.</p>
      </div>
    );
  }

  // Summary logic
  const totalBadges = badges.length;
  const completedCount = badges.filter(b => b.status === 'Completed').length;
  const inProgressCount = badges.filter(b => b.status === 'In Progress').length;
  const notTouchedCount = badges.filter(b => b.status === 'Not touched').length;
  const completionPercent = totalBadges === 0 ? 0 : Math.round((completedCount / totalBadges) * 100);
  const totalCredits = badges.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.estimatedCredits, 0);
  const possibleCredits = badges.reduce((sum, b) => sum + b.estimatedCredits, 0);

  // Category breakdown
  const categoryStats = categories.filter(c => c !== 'All').map(cat => {
    const catBadges = badges.filter(b => b.category === cat);
    const total = catBadges.length;
    const completed = catBadges.filter(b => b.status === 'Completed').length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { name: cat, total, completed, percent };
  }).filter(stat => stat.total > 0).sort((a, b) => a.name.localeCompare(b.name));

  // Filtered list
  const filteredBadges = badges.filter(b => {
    const matchSearch = b.badgeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === '' || b.status === statusFilter;
    const matchCat = categoryFilter === 'All' || b.category === categoryFilter;
    const matchDiff = difficultyFilter === '' || b.difficultyLevel === difficultyFilter;
    return matchSearch && matchStatus && matchCat && matchDiff;
  }).sort((a, b) => {
    if (sortKey === 'difficultyLevel') {
      const valA = DIFF_WEIGHTS[a.difficultyLevel] || 0;
      const valB = DIFF_WEIGHTS[b.difficultyLevel] || 0;
      if (valA < valB) return -1 * sortDir;
      if (valA > valB) return 1 * sortDir;
    } else {
      let valA = a[sortKey] || '';
      let valB = b[sortKey] || '';
      if (valA < valB) return -1 * sortDir;
      if (valA > valB) return 1 * sortDir;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBadges.length / perPage));
  const currentSlice = filteredBadges.slice((currentPage - 1) * perPage, currentPage * perPage);

  const circumference = 125.66;
  const strokeDashoffset = circumference - (circumference * completionPercent / 100);

  return (
    <div className="w-full max-w-7xl mx-auto pt-8 pb-20 px-4 font-sans">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4">
          <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
             <img src={auth.currentUser.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser.email}`} alt="" className="w-full h-full object-cover" />
          </span>
          {auth.currentUser.displayName || 'Student'} · {auth.currentUser.email}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          My Skill Badge Progress
        </h1>
        <p className="text-sm text-slate-500">Track your Google Cloud Arcade skill badges.  Only you can see this.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 border-t-2 border-t-blue-500 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Total Badges</p>
          <p className="text-3xl font-bold text-blue-500">{totalBadges}</p>
          <p className="text-xs text-slate-500 mt-1">In catalogue</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border-t-2 border-t-green-500 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500"/> Completed</p>
          <p className="text-3xl font-bold text-green-500">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Badges done</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border-t-2 border-t-amber-500 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">🔄 In Progress</p>
          <p className="text-3xl font-bold text-amber-500">{inProgressCount}</p>
          <p className="text-xs text-slate-500 mt-1">Started</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border-t-2 border-t-slate-400 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">⬜ Not Touched</p>
          <p className="text-3xl font-bold text-slate-400">{notTouchedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Not started</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border-t-2 border-t-purple-500 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">⚡ Credits Used</p>
          <p className="text-3xl font-bold text-purple-500">{totalCredits}</p>
          <p className="text-xs text-slate-500 mt-1">of <span className="font-semibold text-slate-700 dark:text-slate-300">{possibleCredits}</span> total</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border-t-2 border-t-green-500 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm relative flex items-center justify-between overflow-hidden">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">📊 Completion</p>
            <p className="text-2xl font-bold text-green-500 leading-none mt-2">{completionPercent}%</p>
            <p className="text-xs text-slate-500 mt-1">Done</p>
          </div>
          <div className="relative w-12 h-12 -rotate-90 mr-2">
            <svg className="w-full h-full" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-800" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-green-500 transition-all duration-1000" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset={strokeDashoffset} />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Sidebar: Categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm h-fit">
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Categories</h3>
            <span className="text-[11px] text-slate-400">Click to filter</span>
          </div>
          <div className="flex flex-col">
            <button 
              onClick={() => { setCategoryFilter('All'); setCurrentPage(1); }}
              className={`px-4 py-2.5 flex items-center justify-between text-left text-xs transition-colors border-b border-slate-100/50 dark:border-slate-800/50 ${categoryFilter === 'All' ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className="font-semibold text-blue-500 flex items-center gap-2">
                🌐 All Categories
              </div>
              <span className="text-[11px] text-slate-500">{totalBadges}</span>
            </button>

            {categoryStats.map(stat => {
              const colors = CAT_COLORS[stat.name] || { text: 'text-slate-500', bg: 'bg-slate-500' };
              const isActive = categoryFilter === stat.name;
              return (
                <button 
                  key={stat.name}
                  onClick={() => { setCategoryFilter(stat.name); setCurrentPage(1); }}
                  className={`px-4 py-2.5 flex items-center justify-between text-left text-xs transition-colors border-b border-slate-100/50 dark:border-slate-800/50 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 w-1/2 truncate pr-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')} shadow-sm`}></span>
                    <span className="truncate">{stat.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <div className={`h-full ${colors.text.replace('text-', 'bg-')}`} style={{ width: `${stat.percent}%` }}></div>
                    </div>
                    <span className="text-[11px] text-slate-400 w-8 text-right">{stat.completed}/{stat.total}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>{stat.percent}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content: Table */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center bg-slate-50/50 dark:bg-slate-800/20 rounded-t-xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search badge name..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
            <select 
              value={difficultyFilter} 
              onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Not touched">Not Touched</option>
            </select>
            <span className="text-xs text-slate-500 ml-auto">{filteredBadges.length} badges</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 w-8 text-center">#</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('badgeName')}>Badge Name ↕</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('category')}>Category ↕</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('difficultyLevel')}>Level ↕</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-center cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('estimatedCredits')}>Credits ↕</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-center cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('estimatedHours')}>Hours ↕</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('status')}>Status ↕</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('completionDate')}>Completed ↕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {currentSlice.map((badge, idx) => {
                  const s = badge.status;
                  const catClr = CAT_COLORS[badge.category] || { bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-400' };
                  const diffClr = DIFF_COLORS[badge.difficultyLevel] || { bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-400' };
                  const globalIdx = (currentPage - 1) * perPage + idx + 1;
                  
                  return (
                  <tr key={badge.id} className="hover:bg-slate-50/50 dark:hover:bg-blue-500/5 transition-colors">
                    <td className="px-3 py-2.5 text-center text-slate-400 font-mono text-[10px]">{globalIdx}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200 whitespace-normal min-w-[200px] leading-tight">{badge.badgeName}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${catClr.bg} ${catClr.text}`}>{badge.category}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${diffClr.bg} ${diffClr.text}`}>{badge.difficultyLevel}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{badge.estimatedCredits}</td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{badge.estimatedHours}h</td>
                    <td className="px-3 py-2.5">
                      <select 
                        value={badge.status}
                        onChange={(e) => handleStatusChange(badge.id, e.target.value)}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium border focus:outline-none appearance-none cursor-pointer min-w-[100px] ${
                          s === 'Completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 border-green-200 dark:border-green-800/50' 
                          : s === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 border-blue-200 dark:border-blue-800/50'
                          : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="Not touched">Not touched</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      {s === 'Completed' ? (
                        <input 
                          type="date" 
                          value={badge.completionDate || ''}
                          onChange={(e) => handleDateChange(badge.id, e.target.value)}
                          className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-slate-400 px-2">—</span>
                      )}
                    </td>
                  </tr>
                )})}
                {currentSlice.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      No badges match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/20 mt-auto rounded-b-xl">
            <span>Page {currentPage} of {totalPages} ({filteredBadges.length} results)</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let startPage = Math.max(1, currentPage - 2);
                if (startPage + 4 > totalPages) {
                  startPage = Math.max(1, totalPages - 4);
                }
                const p = startPage + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 rounded-md border text-center min-w-[32px] transition-colors ${p === currentPage ? 'bg-blue-500 text-white border-blue-500 font-bold' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 bg-white dark:bg-slate-800'}`}
                  >
                    {p}
                  </button>
                )
              })}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2.5 rounded-lg shadow-xl shadow-green-500/20 flex items-center gap-2 animate-in slide-in-from-bottom-5 font-semibold text-sm z-50">
          <CheckCircle className="w-4 h-4" />
          <span>✓ {toastMessage}</span>
        </div>
      )}
    </div>
  );
}
