import React from 'react';
import { FacilitatorBonus } from '../components/FacilitatorBonus';
import { FacilitatorDetails } from '../components/FacilitatorDetails';
import { FacilitatorWhy } from '../components/FacilitatorWhy';

export function FacilitatorPage() {
  return (
    <div className="space-y-4 pt-24 pb-20">
      <FacilitatorDetails />
      <FacilitatorWhy />
      <div className="w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-10" />
      <FacilitatorBonus />
    </div>
  );
}
