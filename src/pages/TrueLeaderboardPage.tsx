import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { collection, doc, writeBatch, onSnapshot, getDocs } from 'firebase/firestore';
import { db, auth, loginWithGoogle, loginWithGoogleRedirect, logout } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Search, ChevronUp, ChevronDown, Lock, Unlock, UploadCloud, FileText, Trash2 } from 'lucide-react';

const ADMIN_EMAILS = ["deya58690@gmail.com", "tripti.arcade.25@gmail.com"];

export function TrueLeaderboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for uploading
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Dashboard UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [milestoneFilter, setMilestoneFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [accessFilter, setAccessFilter] = useState('');
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, u => {
      setUser(u);
    });
    
    // Listen to leaderboard changes
    const unsubData = onSnapshot(collection(db, 'leaderboard'), snapshot => {
      const rows = snapshot.docs.map(d => d.data());
      // Handle the case where we save an array inside one doc, or multiple docs.
      // Based on structure: Let's assume we save one document per user for better scaling,
      // but to preserve ranking maybe we just read all docs into one array.
      if (rows.length === 1 && rows[0].participants) {
          // Alternative: stored entirely in one doc
          setData(rows[0].participants);
      } else {
          // Stored as multiple documents
          setData(rows);
      }
      setIsLoading(false);
    }, err => {
      console.error(err);
      setIsLoading(false);
    });

    return () => {
      unsubAuth();
      unsubData();
    };
  }, []);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setUploadStatus('Parsing CSV...');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        setUploadStatus(`Parsing complete. Found ${rows.length} rows.`);
        await processAndUpload(rows);
      }
    });
  };

  const processAndUpload = async (rows: any[]) => {
    try {
      const processed = rows.map((r) => {
        const skill = parseInt(r['# of Skill Badges Completed']) || 0;
        const game = parseInt(r['# of Arcade Games Completed']) || 0;
        const trivia = parseInt(r['# of Trivia Games Completed']) || 0;
        const lab = parseInt(r['# of Lab-free Courses Completed']) || 0;
        const pts = Math.round(((skill * 0.5) + (game * 1) + (trivia * 1) + (lab * 0.5)) * 10) / 10;
        
        let tier = 'No Tier';
        if (pts >= 120) tier = 'Legend';
        else if (pts >= 95) tier = 'Champion';
        else if (pts >= 75) tier = 'Ranger';
        else if (pts >= 50) tier = 'Trooper';

        return {
          id: String(r['User Name'] || Math.random()),
          name: r['User Name'] || '—',
          skill,
          game,
          trivia,
          lab,
          milestone: r['Milestone Earned'] || 'None',
          access: r['Access Code Redemption Status'] || 'No',
          points: pts,
          tier,
        };
      });

      // Sort by points to assign rank
      processed.sort((a, b) => b.points - a.points);
      processed.forEach((p, i) => (p as any).rank = i + 1);

      setUploadStatus(`Saving to Firebase...`);
      
      // We will store it all in one document for simplicity since it's < 1MB 
      // typically unless there are >10k rows. 
      // If we use multiple, we have to batch them up to 500 at a time and delete old ones.
      // Let's use batches.
      const collRef = collection(db, 'leaderboard');
      const existingDocs = await getDocs(collRef);
      
      // Delete existing
      let batch = writeBatch(db);
      let opCount = 0;
      
      for (const docSnap of existingDocs.docs) {
        batch.delete(docSnap.ref);
        opCount++;
        if (opCount >= 400) {
          await batch.commit();
          batch = writeBatch(db);
          opCount = 0;
        }
      }
      
      // Important to use the document 'data' instead of individual rows? 
      // One doc is much faster and simpler for just reading it all at once!
      // max 1 MB per document. Example row: ~200 bytes. 1MB = 5000 rows.
      // Let's use a single document `data` containing `{ participants: [...] }`.
      await batch.commit();

      const singleDocRef = doc(db, 'leaderboard', 'data');
      await writeBatch(db).set(singleDocRef, { participants: processed, updatedAt: Date.now() }).commit();

      setUploadStatus('Upload successful! Data is live.');
    } catch (err: any) {
      console.error(err);
      setUploadStatus('Error uploading: ' + err.message);
    } finally {
      setTimeout(() => setUploading(false), 3000);
    }
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteData = async () => {
    setUploading(true);
    setUploadStatus('Deleting data...');
    try {
      const collRef = collection(db, 'leaderboard');
      const existingDocs = await getDocs(collRef);
      const batches = [];
      let currentBatch = writeBatch(db);
      let opCount = 0;
      
      existingDocs.docs.forEach((docSnap) => {
        currentBatch.delete(docSnap.ref);
        opCount++;
        if (opCount === 490) {
          batches.push(currentBatch.commit());
          currentBatch = writeBatch(db);
          opCount = 0;
        }
      });
      if (opCount > 0) {
        batches.push(currentBatch.commit());
      }
      await Promise.all(batches);
      setData([]);
      setShowConfirmDelete(false);
      setUploadStatus('Data deleted successfully.');
    } catch (e: any) {
      console.error(e);
      setUploadStatus('Error deleting data: ' + e.message);
    } finally {
      setTimeout(() => { setUploading(false); setUploadStatus(''); }, 3000);
    }
  };

  // ----- Filtering and Sorting -----
  const filtered = useMemo(() => {
    let res = data.filter(r => {
      if (searchTerm && !r.name.toLowerCase().includes(searchTerm.toLowerCase()) && !r.milestone.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (milestoneFilter && r.milestone !== milestoneFilter) return false;
      if (tierFilter && r.tier !== tierFilter) return false;
      if (accessFilter && r.access !== accessFilter) return false;
      return true;
    });

    res.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir;
      if (av > bv) return -sortDir;
      return 0;
    });
    return res;
  }, [data, searchTerm, milestoneFilter, tierFilter, accessFilter, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d * -1);
    else {
      setSortKey(key);
      setSortDir(-1);
    }
  };

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Stats
  const statTotal = data.length;
  const statActive = data.filter(r => r.access === 'Yes').length;
  const statPoints = Math.round(data.reduce((s, r) => s + r.points, 0) * 10) / 10;
  const statMilestone = data.filter(r => r.milestone !== 'None').length;

  const top3 = useMemo(() => {
    return [...data].sort((a, b) => b.points - a.points).slice(0, 3);
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-100 dark:bg-[#0b2144] rounded-2xl p-8 mb-10 text-slate-900 dark:text-white max-w-4xl mx-auto shadow-sm border border-slate-200 dark:border-[#1e3a6a] text-center">
         <h2 className="text-3xl md:text-4xl font-bold font-display flex items-center justify-center gap-3 mb-4 text-slate-900 dark:text-white">
           🏆 Arcade Leaderboard 🏆
         </h2>
         <p className="text-slate-700 dark:text-slate-200 text-lg mb-4 max-w-2xl mx-auto font-medium">
           Climb the ranks, earn exclusive rewards, and secure your spot among the top achievers!
         </p>
         <p className="text-[#e29302] dark:text-[#FBBC05] font-semibold text-lg mb-8">
           ✨ Top achievers can earn exclusive vouchers from the Arcade Team. ✨
         </p>
         
         <div className="bg-white dark:bg-[#4d5e75] border border-slate-200 dark:border-white/20 rounded-xl p-6 shadow-sm">
           <h3 className="text-[#e29302] dark:text-[#FBBC05] font-bold text-xl md:text-2xl mb-2">Want to win exclusive rewards?</h3>
           <p className="text-slate-800 dark:text-white font-medium">Keep earning points and climb the leaderboard to receive Arcade-exclusive rewards!</p>
         </div>
      </div>

      {isAdmin && (
        <div className="bg-[#eff4ff] dark:bg-blue-900/20 border-2 border-dashed border-[#93b4fd] dark:border-blue-500/50 rounded-2xl p-8 text-center mb-10 transition-colors">
           <div className="flex justify-center mb-3">
             <UploadCloud className="w-10 h-10 text-blue-500" />
           </div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload Daily CSV</h3>
           <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
             Upload the roster from Google Cloud Skills Boost. Only you can see this panel.
           </p>
           
           <label className="relative inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
             <span>Choose CSV File</span>
             <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={uploading} />
           </label>
           {data.length > 0 && (
             <div className="inline-block relative ml-4">
               {!showConfirmDelete ? (
                 <button 
                   onClick={() => setShowConfirmDelete(true)} 
                   disabled={uploading}
                   className="relative inline-flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 font-semibold py-2.5 px-6 rounded-xl transition-colors"
                 >
                   <Trash2 className="w-4 h-4 mr-2" /> Delete Data
                 </button>
               ) : (
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={handleDeleteData} 
                     disabled={uploading}
                     className="relative inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                   >
                     Confirm
                   </button>
                   <button 
                     onClick={() => setShowConfirmDelete(false)} 
                     disabled={uploading}
                     className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition-colors"
                   >
                     Cancel
                   </button>
                 </div>
               )}
             </div>
           )}
           
           {uploadStatus && (
             <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
               {uploadStatus}
             </div>
           )}
        </div>
      )}

      {/* TOP 3 LEADERBOARD */}
      {data.length >= 3 && !isLoading && (
        <div className="mb-12 mt-4 text-center">
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 max-w-4xl mx-auto">
            {top3[1] && <TopCard participant={top3[1]} rank={2} />}
            {top3[0] && <TopCard participant={top3[0]} rank={1} />}
            {top3[2] && <TopCard participant={top3[2]} rank={3} />}
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard color="blue" label="Total Participants" value={statTotal} sub="Registered" />
        <StatCard color="green" label="Access Redeemed" value={statActive} sub="Confirmed" />
        <StatCard color="orange" label="Points Earned" value={statPoints} sub="Across all" />
        <StatCard color="purple" label="Milestone Achievers" value={statMilestone} sub="Any milestone" />
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input type="text" placeholder="Search name or milestone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm" />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <SelectFilter value={milestoneFilter} onChange={setMilestoneFilter} defaultLabel="All Milestones" options={['Ultimate Milestone', 'Milestone 3', 'Milestone 2', 'Milestone 1', 'None']} />
          <SelectFilter value={tierFilter} onChange={setTierFilter} defaultLabel="All Tiers" options={['Legend', 'Champion', 'Ranger', 'Trooper', 'No Tier']} />
          <SelectFilter value={accessFilter} onChange={setAccessFilter} defaultLabel="All Access" options={[{v: 'Yes', l: 'Redeemed'}, {v: 'No', l: 'Not Redeemed'}]} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-xs tracking-wider font-semibold">
                <SortableHeader label="RANK" field="rank" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                <SortableHeader label="PARTICIPANT" field="name" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                <SortableHeader label="POINTS" field="points" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                <th className="px-6 py-4">BADGES</th>
                <SortableHeader label="MILESTONE" field="milestone" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                <SortableHeader label="TIER" field="tier" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                <th className="px-6 py-4">ACCESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">Loading leaderboard data...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-500">No participants match filters.</td></tr>
              ) : (
                paginated.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-slate-500 dark:text-slate-400">
                       {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="font-semibold text-slate-900 dark:text-white">{r.name}</div>
                       <div className="text-[11px] text-slate-500 mt-0.5">Skill: {r.skill} | Game: {r.game} | Trivia: {r.trivia} | Lab: {r.lab}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-blue-600 dark:text-blue-400">
                       {r.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex gap-1.5 flex-wrap">
                         {r.skill > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">🎯 {r.skill} Skill</span>}
                         {r.game > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">🎮 {r.game} Game</span>}
                         {r.trivia > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">❓ {r.trivia} Trivia</span>}
                         {r.lab > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">📚 {r.lab} Lab</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <MilestonePill milestone={r.milestone} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <TierPill tier={r.tier} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                       <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${r.access === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                       {r.access === 'Yes' ? 'Redeemed' : 'Pending'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">
             Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
             <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Prev</button>
             <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function StatCard({ color, label, value, sub }: any) {
  const clrMap: any = { blue: 'text-blue-600', green: 'text-green-600', orange: 'text-orange-500', purple: 'text-purple-600' };
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 text-left">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-3xl font-mono font-bold ${clrMap[color]}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

function SelectFilter({ value, onChange, defaultLabel, options }: any) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-slate-700 dark:text-slate-300">
      <option value="">{defaultLabel}</option>
      {options.map((o: any) => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function SortableHeader({ label, field, sortKey, sortDir, onClick }: any) {
  const isSorted = sortKey === field;
  return (
    <th className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors group select-none" onClick={() => onClick(field)}>
      <div className="flex items-center gap-1">
        {label}
        <span className={`text-slate-400 group-hover:text-blue-500 ${isSorted ? 'opacity-100' : 'opacity-30'}`}>
          {isSorted ? (sortDir === 1 ? '↑' : '↓') : '↕'}
        </span>
      </div>
    </th>
  );
}

function MilestonePill({ milestone }: { milestone: string }) {
  let clr = "";
  if (milestone === 'Ultimate Milestone') clr = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  else if (milestone === 'Milestone 3') clr = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  else if (milestone === 'Milestone 2') clr = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
  else if (milestone === 'Milestone 1') clr = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  else clr = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${clr}`}>{milestone}</span>;
}

function TierPill({ tier }: { tier: string }) {
  let clr = "";
  if (tier === 'Legend') clr = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  else if (tier === 'Champion') clr = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  else if (tier === 'Ranger') clr = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
  else if (tier === 'Trooper') clr = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  else clr = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${clr}`}>{tier}</span>;
}

function TopCard({ participant, rank }: { participant: any; rank: number }) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  
  const bgClass = isFirst 
    ? 'bg-[#F8E2AC] border-[#E8D490]' // Gold
    : isSecond
      ? 'bg-[#D1D4DA] border-[#BFC3CA]' // Silver
      : 'bg-[#E3C2A4] border-[#D6A982]'; // Bronze
      
  const rankColor = isFirst ? 'text-[#DCA821]' : isSecond ? 'text-[#7B8394]' : 'text-[#CE7424]';
  const avatarBgColor = isFirst ? 'E91E63' : isSecond ? '111111' : '607D8B';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=${avatarBgColor}&color=fff&size=128`;
  
  const sizeClass = isFirst ? 'w-[280px] h-[220px]' : 'w-[260px] h-[200px]';

  return (
    <div className={`relative rounded-xl flex flex-col items-center justify-center p-6 border shadow-sm ${bgClass} ${sizeClass} mx-auto md:mx-0`}>
      <div className={`absolute top-4 right-4 w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold shadow-sm ${rankColor}`}>
        #{rank}
      </div>
      
      <div className={`rounded-full p-1 bg-white mb-3 ${isFirst ? 'w-24 h-24' : 'w-20 h-20'} shadow-sm flex items-center justify-center`}>
         <div className="w-full h-full rounded-full border-[3px] border-[#A87CFA] overflow-hidden">
            <img src={avatarUrl} alt={participant.name} className="w-full h-full object-cover" />
         </div>
      </div>
      
      <h3 className="font-bold text-slate-900 text-[15px] mb-2 text-center w-full truncate px-2">
        {participant.name}
      </h3>
      <div className="px-3 py-1 bg-[#DBCDF7]/80 rounded-full text-[#7B46F1] font-semibold text-[11px]">
        {participant.points} points
      </div>
    </div>
  );
}
