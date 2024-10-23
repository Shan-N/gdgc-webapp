// app/api/auth/confirm/route.ts
import { createClient } from '@/app/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { EmailOtpType } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/error?error=Missing parameters`
    );
  }

  // Validate the type
  const validEmailTypes = ['forgot_password', 'update_password'];
  if (!validEmailTypes.includes(type as EmailOtpType)) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/error?error=Invalid OTP type`
    );
  }

  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/error?error=${error.message}`
    );
  }

  // After successful verification, redirect to reset password page
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/user/reset-password?verified=true`
  );
}