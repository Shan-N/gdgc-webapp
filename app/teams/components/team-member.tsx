"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Github, Linkedin, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link';

export interface TeamMemberProps {
  username: string
  full_name: string | null
  avatar_url: string
  current_year: string
  current_branch: string
  field: string
  github_url: string
  linkedin_url: string
  colorIndex: number
}

const colors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58']

export default function Component({
  username,
  full_name,
  avatar_url,
  current_year,
  current_branch,
  field,
  github_url,
  linkedin_url,
  colorIndex
}: TeamMemberProps) {
  if (full_name === null) {
    return null
  }

  const color = colors[colorIndex % colors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/teams/${username}`}>
      <Card className="overflow-hidden bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <div
            className="h-32 w-full"
            style={{ backgroundColor: color }}
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <picture>
              <img
                src={avatar_url}
                alt={full_name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            </picture>
          </div>
        </div>
        <div className="pt-16 pb-6 px-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{full_name}</h3>
          <Badge variant="secondary" className="mb-2">
            {username}
          </Badge>
          <p className="text-sm text-gray-600 mb-4">{field}</p>
          <div className="flex justify-center space-x-2 mb-4">
            <Badge variant="outline" className="text-xs">
              {current_year} Year
            </Badge>
            <Badge variant="outline" className="text-xs">
              {current_branch}
            </Badge>
          </div>
          <div className="flex justify-center space-x-4">
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {linkedin_url && (
              <a
                href={linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>
        </div>
        <div
          className="py-3 px-6 bg-gray-50 flex justify-between items-center"
          style={{ borderTop: `3px solid ${color}` }}
        >
          <span className="text-sm font-medium text-gray-900">View Profile</span>
          <ChevronRight size={16} className="text-gray-600" />
        </div>
      </Card>
      </Link>
    </motion.div>
  )
}