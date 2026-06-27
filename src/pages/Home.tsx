import React from 'react';
import { Hero } from '../components/Hero';
import { Community } from '../components/Community';
import { Registration } from '../components/Registration';
import { RegistrationSteps } from '../components/RegistrationSteps';
import { RegistrationGuideWidget } from '../components/RegistrationGuideWidget';
import { CommunityWelcomeModal } from '../components/CommunityWelcomeModal';

export function Home({ participants }: { participants: any[] }) {
  return (
    <div className="space-y-4 relative">
      <Hero participants={participants} />
      <Community />
      <div className="w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-4" />
      <Registration />
      <RegistrationSteps />
      
      <RegistrationGuideWidget />
      <CommunityWelcomeModal />
    </div>
  );
}
