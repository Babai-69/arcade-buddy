import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { TrueLeaderboardPage } from './pages/TrueLeaderboardPage';
import { LeaderboardPage as DashboardPage } from './pages/LeaderboardPage';
import { FacilitatorPage } from './pages/FacilitatorPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SwagsPage } from './pages/SwagsPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { PublicProfileHelpPage } from './pages/PublicProfileHelpPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CodeOfConductPage } from './pages/CodeOfConductPage';
import { ProgramTnCsPage } from './pages/ProgramTnCsPage';
import { FaqPage } from './pages/FaqPage';
import { MyProgressPage } from './pages/MyProgressPage';
import { AdminProgressPage } from './pages/AdminProgressPage';
import { AdminPanel } from './components/AdminPanel';
import { ScrollToTop } from './components/ScrollToTop';
import { mockParticipants } from './data/sampleData';
import { Participant } from './types';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <ScrollToTop />
      <div className="mesh-bg"></div>
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home participants={participants} />} />
          <Route path="/leaderboard" element={<TrueLeaderboardPage />} />
          <Route path="/dashboard" element={<DashboardPage participants={participants} />} />
          <Route path="/facilitator" element={<FacilitatorPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/public-profile-help" element={<PublicProfileHelpPage />} />
          <Route path="/swags" element={<SwagsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/my-progress" element={<MyProgressPage />} />
          <Route path="/admin-progress" element={<AdminProgressPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/code-of-conduct" element={<CodeOfConductPage />} />
          <Route path="/program-tncs" element={<ProgramTnCsPage />} />
        </Routes>
        
        {/* Hidden Admin Route using hash for easy access by the creator */}
        {window.location.hash === '#admin' && (
          <div className="mt-20">
            <AdminPanel onUpdateParticipants={setParticipants} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

