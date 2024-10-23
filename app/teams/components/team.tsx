'use client';

import { useState, useEffect } from 'react';
import TeamMember, { TeamMemberProps } from '@/app/teams/components/team-member';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AHHHHBACKKKKK from '@/components/back-button';

// Define the field order
const fieldOrder = [
  'Supreme Leader',
  'Management',
  'DevOps',
  'Design',
  'AIML',
  'Other'
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  const groupedMembers = teamMembers.reduce((acc, member) => {
    // Ensure we have a valid field name and normalize it
    let field = member.field || 'Other';
    
    // Normalize field names to match our defined order
    field = field.trim();
    if (field.toLowerCase() === 'devops') field = 'DevOps';
    if (field.toLowerCase() === 'aiml') field = 'AIML';
    
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(member);
    return acc;
  }, {} as Record<string, TeamMemberProps[]>);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-10">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-8">
      <div className="mb-4">
        <AHHHHBACKKKKK />
      </div>
      
      <Card className="p-8 mb-8">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-4xl font-bold">GDGC PCCoE Team</h1>
            <p className="text-xl font-medium mt-2">2024-25</p>
          </CardTitle>
        </CardHeader>
      </Card>

      {fieldOrder.map((field) => {
        const members = groupedMembers[field];
        if (!members?.length) return null;

        return (
          <Card key={`field-${field}`} className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">{field}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, index) => (
                  <TeamMember
                    key={`${field}-${member.username || index}`}
                    {...member}
                    colorIndex={index}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}