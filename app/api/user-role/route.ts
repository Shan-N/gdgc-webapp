// app/api/user-role/route.ts
import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role, permissions')
    .eq('user_id', user.id)
    .single()

  if (roleError) {
    console.error('Error fetching user role:', roleError)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(userRole)
}