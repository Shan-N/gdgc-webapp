"use server";

import TeamCard from '@/app/teams/components/team';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin h-16 w-16 text-blue-500" />
        <span className="text-2xl font-medium text-gray-700">Loading</span>
      </div>
    </div>
  );
}

export default async function LoginPage() {
  return (
    <div className="min-h-screen w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <TeamCard />
      </Suspense>
    </div>
  );
}