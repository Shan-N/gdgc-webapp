// app/api/auth/forgot-password/route.ts
import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm`
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send reset instructions' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Check your email for the reset instructions'
    });

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}