import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  
  try {
    const body = await request.json()
    const { email, password, full_name, username, current_year, current_branch, phone_number, prn } = body

    // Input validation
    if (!email || !password || !full_name || !username || !current_year || !current_branch || !phone_number || !prn) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Create a new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }

    // Create or update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        full_name,
        username,
        current_year,
        current_branch,
        phone_number,
        prn,
        has_console_access: false,
        is_gdsc_member: false,
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Profile error:', profileError)
      // If profile creation fails, we should delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Profile creation failed' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Signup successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username,
        full_name
      }
    })

  } catch (error) {
    console.error('Unexpected error during signup:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}