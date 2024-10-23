'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from 'next/link'

interface TeamMember {
  username: string;
  full_name: string;
  avatar_url: string;
  current_year: string;
  current_branch: string;
  field: string;
  github_url: string;
  linkedin_url: string;
}

export default function TeamMemberProfile() {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    async function fetchMember() {
      try {
        const response = await fetch(`/api/team/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team member');
        }
        const data = await response.json();
        setMember(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchMember();
    }
  }, [username]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl font-bold text-[#4285F4]">Loading...</div>;
  }

  if (!member) {
    return <div className="flex items-center justify-center h-screen text-2xl font-bold text-[#DB4437]">Member not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link href="/teams" passHref>
        <Button variant="ghost" className="mb-6 text-[#4285F4] hover:text-[#4285F4] hover:bg-[#E8F0FE]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
        </Button>
      </Link>
      <Card className="max-w-4xl mx-auto overflow-hidden bg-[#FEEAE6]">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-8">
              <div className="text-sm font-medium text-[#4285F4] mb-2">HI, MY NAME IS</div>
              <h1 className="text-6xl font-bold text-[#DB4437] mb-4">{member.full_name.split(' ')[0].toUpperCase()}</h1>
              <div className="text-xl font-medium text-[#0F9D58] mb-4">*({member.field.toUpperCase()})</div>
              <p className="text-sm text-[#5F6368] mb-6">
                {member.full_name}, {member.current_year} year {member.current_branch} student, organizes tech events, facilitates
                learning, and builds a student developer community, bridging campus talent
                with Google&apos;s resources.
              </p>
              <div className="flex space-x-2 mb-4">
                <Button variant="outline" className="rounded-full text-[#4285F4] border-[#4285F4] hover:bg-[#E8F0FE]">
                  {member.current_branch}
                </Button>
                <Button variant="outline" className="rounded-full text-[#0F9D58] border-[#0F9D58] hover:bg-[#E6F4EA]">
                  {member.field}
                </Button>
              </div>
              <div className="text-sm font-medium text-[#5F6368]">@{member.username}</div>
            </div>
            <div className="relative">
              <img
                src={member.avatar_url || '/default-avatar.png'}
                alt={`${member.full_name}'s avatar`}
                className="w-full h-full object-cover"
              />
              {/* <div className="absolute bottom-4 left-4 bg-white rounded-full overflow-hidden border-2 border-[#DB4437] w-24 h-24">
                <img
                  src={member.avatar_url || '/default-avatar.png'}
                  alt={`${member.full_name}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}