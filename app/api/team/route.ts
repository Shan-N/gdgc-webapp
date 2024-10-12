import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url, current_year, current_branch, field, github_url, linkedin_url');

  if (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }

  return NextResponse.json(data);
}