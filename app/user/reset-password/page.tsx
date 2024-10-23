import React, { Suspense } from 'react';
import ForgotPassword from '../forgot-password/components/forget-password';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}