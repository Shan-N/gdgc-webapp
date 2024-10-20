import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')

  const supabase = createClient()

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (token_hash) {
    // Handle token_hash if needed
    console.log('Received token_hash:', token_hash)
  }

  // Redirect to a success page or the home page
  return NextResponse.redirect(new URL('/', request.url))
}