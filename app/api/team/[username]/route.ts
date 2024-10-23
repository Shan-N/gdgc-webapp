import { createClient } from '@/app/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const supabase = createClient();
  const { username } = params;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('has_console_access', true)
    .eq('is_gdsc_member', true)
    .single();

  if (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}