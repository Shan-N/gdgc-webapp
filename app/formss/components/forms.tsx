'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@supabase/supabase-js';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
  current_year: string;
  current_branch: string;
  phone_number: string;
  rfid_tag: string;
  prn: string;
}

interface Event {
  id: number;
  name: string;
}

const EventRegistrationForm = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    full_name: '',
    avatar_url: '',
    current_year: '',
    current_branch: '',
    phone_number: '',
    rfid_tag: '',
    prn: '',
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let ignore = false;

    async function getProfileAndEvents() {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      if (!ignore) {
        setUser(user);

        try {
          const profileResponse = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile');
          }

          const { data: profileData } = await profileResponse.json();
          if (profileData) {
            setProfile(profileData);
          }

          const eventsResponse = await fetch('/api/events');
          if (!eventsResponse.ok) {
            throw new Error('Failed to fetch events');
          }

          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    getProfileAndEvents();

    return () => {
      ignore = true;
    }
  }, [supabase.auth]);

  const handleEventToggle = (eventId: number) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_ids: selectedEvents }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 400 && data.alreadyRegisteredEvents) {
          const alreadyRegisteredNames = data.alreadyRegisteredEvents
            .map((eventName: string) => {
              const event = events.find(e => e.id === Number(eventName));
              return event ? event.name : `Event ID ${eventName}`;
            })
            .join(', ');
          
          if (alreadyRegisteredNames) {
            alert(`You're already registered for: ${alreadyRegisteredNames}`);
          } else {
            alert('You are already registered for some events.');
          }
        } else {
          throw new Error(data.error || 'Failed to register for events');
        }
      } else {
        alert('Registration successful!');
        setSelectedEvents([]);
      }
    } catch (error) {
      console.error('Error registering for events:', error);
      alert('Failed to register for events. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>Event Registration</CardTitle>
            <CardDescription>Loading user data...</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Skeleton className="h-12 w-[180px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>Event Registration</CardTitle>
            <CardDescription>No active session</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p>Please sign in to register for events.</p>
            <Button onClick={() => router.push('/user/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto">        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Event Registration</CardTitle>
            <CardDescription>Register for upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback>{profile.full_name ? profile.full_name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.full_name || 'Your Name'}</h2>
                  <p className="text-sm text-gray-500">{profile.username || user.email}</p>
                  <div className="flex-col sm:flow-row space-y-2 sm:space-x-2 mt-2">
                    <Badge variant="secondary">{profile.current_year} Year</Badge>
                    <Badge variant="secondary">{profile.current_branch}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prn" className='font-medium'>PRN</Label> 
                  <br/>
                  <Badge variant="secondary" id="prn" className="text-sm font-medium">{profile.prn}</Badge>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <br/>
                  <Badge variant="secondary" id="phone" className="text-sm font-medium">{profile.phone_number || 'Not provided'}</Badge>
                </div>
              </div>


              <div className="space-y-4">
                <Label>Select Events</Label>
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => handleEventToggle(event.id)}
                    />
                    <Label htmlFor={`event-${event.id}`} className="font-medium">
                      {event.name}
                    </Label>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">Register for Events</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventRegistrationForm;