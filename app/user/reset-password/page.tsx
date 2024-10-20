import React, { Suspense } from 'react';
import PasswordResetPage from '@/app/user/reset-password/components/PasswordResetPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordResetPage />
    </Suspense>
  );
}