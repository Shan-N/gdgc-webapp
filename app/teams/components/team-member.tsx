import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin } from 'lucide-react';

export interface TeamMemberProps {
  username: string;
  full_name: string | null;
  avatar_url: string;
  current_year: string;
  current_branch: string;
  field: string;
  github_url: string;
  linkedin_url: string;
}

interface TeamMemberComponentProps extends TeamMemberProps {
  colorIndex: number;
}

const TeamMember: React.FC<TeamMemberComponentProps> = ({
  username,
  full_name,
  avatar_url,
  current_year,
  current_branch,
  field,
  github_url,
  linkedin_url,
  colorIndex
}) => {
  if (full_name === null) {
    return null;
  }

  const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-purple-100'];
  const bgColor = colors[colorIndex % colors.length];

  return (
    <Card className={`${bgColor} overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <picture>
          <img
            src={avatar_url}
            alt={full_name}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          </picture>
          <div>
            <h3 className="text-lg font-semibold">{full_name}</h3>
            <p className="text-sm text-gray-600">{username}</p>
          </div>
        </div>
        <p className="mb-2"><strong>Year:</strong> {current_year}</p>
        <p className="mb-2"><strong>Branch:</strong> {current_branch}</p>
        <p className="mb-4"><strong>Field:</strong> {field}</p>
        <div className="flex space-x-4">
          {github_url && (
            <a href={github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
              <Github size={24} />
            </a>
          )}
          {linkedin_url && (
            <a href={linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
              <Linkedin size={24} />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;