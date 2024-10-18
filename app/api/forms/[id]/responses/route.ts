import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  
  if (!params.id) {
    return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
  }

  // Get the user's session
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Supabase getUser error:', userError)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { data: responses, error } = await supabase
    .from('responses')
    .select(`
      id,
      form_id,
      respondent_id,
      submitted_at,
      custom_fields,
      answers(*, question:questions(*))
    `)
    .eq('form_id', params.id)
    .eq('respondent_id', user.id)

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }

  return NextResponse.json(responses || [])
}