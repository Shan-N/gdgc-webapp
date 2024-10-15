import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  
  if (!params.id) {
    return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
  }

  const { data: responses, error } = await supabase
    .from('responses')
    .select('*, answers(*, question:questions(*))')
    .eq('form_id', params.id)

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }

  return NextResponse.json(responses || [])
}