import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  
  const body = await request.json()
  const { token, email } = body

  try {
    const { error } = await supabase.auth.verifyOtp({
      token,
      type: 'signup',
      email
    })

    if (error) {
      throw error
    }

    // If verification is successful, you might want to update the user's status
    // or perform any other necessary actions here

    return NextResponse.json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }
}