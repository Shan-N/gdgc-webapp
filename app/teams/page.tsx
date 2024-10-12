'use client';

import { useState, useEffect } from 'react';
import TeamMember, { TeamMemberProps } from '@/app/teams/components/team-member';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch('/api/team');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  const groupedMembers = teamMembers.reduce((acc, member) => {
    const field = member.field || 'Other';
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(member);
    return acc;
  }, {} as Record<string, TeamMemberProps[]>);

  if (loading) {
    return <div className="text-center py-10">Loading team members...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Team</h1>
      {Object.entries(groupedMembers).map(([field, members], fieldIndex) => (
        <Card key={field} className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{field}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, memberIndex) => (
                <TeamMember
                  key={member.username}
                  {...member}
                  colorIndex={fieldIndex * members.length + memberIndex}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}