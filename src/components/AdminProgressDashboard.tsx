import React, { useState, useEffect } from 'react';
import { getAdminAllStudents, getUserProgress, UserProfile, UserBadgeProgress } from '../lib/userProgressService';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

export function AdminProgressDashboard() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentBadges, setStudentBadges] = useState<UserBadgeProgress[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin
    const checkAdmin = async () => {
      if (!auth.currentUser || (auth.currentUser.email !== 'deya58690@gmail.com' && auth.currentUser.email !== 'tripti.arcade.25@gmail.com')) {
        navigate('/');
        return;
      }
      try {
        const data = await getAdminAllStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSelectStudent = async (student: UserProfile) => {
    setSelectedStudent(student);
    setLoadingBadges(true);
    try {
      const badges = await getUserProgress(student.uid);
      setStudentBadges(badges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBadges(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading admin view...</div>;

  if (selectedStudent) {
    const completedCount = studentBadges.filter(b => b.status === 'Completed').length;
    const completionPercent = studentBadges.length === 0 ? 0 : Math.round((completedCount / studentBadges.length) * 100);

    return (
      <div className="w-full max-w-7xl mx-auto pt-24 pb-20 px-4">
        <button 
          onClick={() => setSelectedStudent(null)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Students
        </button>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
          <img src={selectedStudent.photoURL || `https://ui-avatars.com/api/?name=${selectedStudent.email}`} alt="" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h2>
            <p className="text-slate-500">{selectedStudent.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-slate-500">Completion</p>
            <p className="text-2xl font-bold text-blue-500">{completionPercent}%</p>
          </div>
        </div>

        {loadingBadges ? (
          <div className="text-center p-12 text-slate-500">Loading badges...</div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-500">Badge</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Category</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Date</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentBadges.map(b => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{b.badgeName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{b.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        b.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        b.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{b.completionDate || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{b.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-20 px-4">
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">Admin: All Students Progress</h1>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500">Student</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Last Active</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map(s => (
              <tr key={s.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onClick={() => handleSelectStudent(s)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={s.photoURL || `https://ui-avatars.com/api/?name=${s.email}`} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.email}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{new Date(s.lastUpdated || s.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-500 hover:text-blue-700 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                    View Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
