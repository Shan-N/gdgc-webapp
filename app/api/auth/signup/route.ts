import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  
  const body = await request.json()
  const { email, password, full_name, current_year, current_branch, phone_number, prn } = body

  // Create a new user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Create a new profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authData.user!.id,
      full_name,
      current_year,
      current_branch,
      phone_number,
      prn,
      updated_at: new Date().toISOString(),
    })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({ message: 'Signup successful' })
}