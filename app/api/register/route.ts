import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { event_ids } = await request.json();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!event_ids || !Array.isArray(event_ids)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch event details including names
  const { data: eventDetails, error: eventFetchError } = await supabase
    .from('events')
    .select('id, name')
    .in('id', event_ids);

  if (eventFetchError) {
    return NextResponse.json({ error: 'Error fetching event details' }, { status: 500 });
  }

  // Create a map of event_id to event_name
  const eventMap = new Map(eventDetails.map(event => [event.id, event.name]));

  // Check for existing registrations
  const { data: existingRegistrations, error: fetchError } = await supabase
    .from('event_registrations')
    .select('event_id')
    .eq('user_id', user.id)
    .in('event_id', event_ids);

  if (fetchError) {
    return NextResponse.json({ error: 'Error checking existing registrations' }, { status: 500 });
  }

  const alreadyRegisteredEvents = existingRegistrations?.map(reg => reg.event_id) || [];

  if (alreadyRegisteredEvents.length > 0) {
    return NextResponse.json({ 
      error: 'Already registered for some events', 
      alreadyRegisteredEvents 
    }, { status: 400 });
  }

  // Proceed with registration for new events
  const newRegistrations = event_ids.map(event_id => ({
    user_id: user.id,
    event_id,
    event_name: eventMap.get(event_id) || 'Unknown Event'
  }));

  const { data, error } = await supabase
    .from('event_registrations')
    .insert(newRegistrations);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Registration successful', data });
}

export async function GET() {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
      id,
      event_id,
      event_name,
      created_at
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}