import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(`username, full_name, website, phone_number, avatar_url, current_year, current_branch, prn, github_url, instagram_url, linkedin_url, rfid_tag`)
    .eq('id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
    const supabase = createClient()
  
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
  
    const body = await request.json()
  
    const updates = {
      id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    }
  
    const { data, error } = await supabase.from('profiles').upsert(updates)
  
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  
    return NextResponse.json({ data })
  }