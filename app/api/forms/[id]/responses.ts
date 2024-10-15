import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: responses, error } = await supabase
    .from('responses')
    .select('submitted_at, answers(answer_text, answer_json, question:questions(question_text, question_type))')
    .eq('form_id', params.id);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }

  return NextResponse.json(responses || []);
}
