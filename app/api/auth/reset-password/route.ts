// app/api/auth/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const redirectUrl = searchParams.get('redirectUrl');

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/error?error=Missing parameters`
    );
  }

  // Redirect to reset password page or specified redirect URL
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/user/reset-password?token=${tokenHash}&type=${type}&redirectUrl=${redirectUrl}`
  );
}