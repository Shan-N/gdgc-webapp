"use client"

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Badge } from "@/components/ui/badge"

const teamMembers = [
  {
    name: "Kartik Kulloli",
    branch: "Tech Part",
    year: "Second Year",
    college_branch: "Information Technology",
    description: "Built the site you are currently viewing. From the SQL (seqel) queries to architecturing the API to the React components, done it all.",
    image: "/placeholder.svg?height=400&width=300",
    color: "from-blue-400 to-cyan-300",
  },
  {
    name: "Kunal Shitole",
    branch: "Documents, Tech Part",
    year: "Second Year",
    college_branch: "Computer Engineering",
    description: "Meow",
    image: "/placeholder.svg?height=400&width=300",
    color: "from-green-400 to-emerald-300",
  },
  {
    name: "Rugved Zambare",
    branch: "Video & Promotion",
    year: "Second Year",
    college_branch: "Computer Engineering",
    description: "Meow",
    image: "/placeholder.svg?height=400&width=300",
    color: "from-purple-400 to-pink-300",
  }
]

interface TeamMember {
  name: string;
  branch: string;
  college_branch: string;
  year: string;
  description: string;
  image: string;
  color: string;
}

const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={cardRef}
      className={`relative bg-gradient-to-br ${member.color} text-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto mb-24`}
    >
      <motion.div 
        className="flex flex-col md:flex-row items-center p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <div className="flex-1 z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {member.name}
          </motion.h2>
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Badge variant="secondary" className="mr-2 bg-white/20 text-white">
              {member.branch}
            </Badge>
            <Badge variant="outline" className="mr-2 border-white/40 text-white">
              {member.year}
            </Badge>
            <Badge variant="outline" className="border-white/40 text-white">
              {member.college_branch}
            </Badge>
          </motion.div>
          <motion.p 
            className="mb-6 text-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {member.description}
          </motion.p>
        </div>
        <motion.div 
          className="mt-8 md:mt-0 md:absolute md:-right-16 md:top-1/2 md:transform md:-translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <img 
            src={member.image}
            alt={`${member.name} profile`}
            className="w-64 md:w-80 rounded-3xl transform rotate-6 shadow-lg"
          />
        </motion.div>
      </motion.div>
      <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" fillOpacity="0.1"/>
      </svg>
    </div>
  )
}

export default function TeamCards() {
  return (
    <main className="relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center p-4 space-y-8 min-h-screen">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={member.name} member={member} index={index} />
        ))}
      </div>
      <div className="overflow-hidden">
          <img 
              src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1729371017/gdgc/team123_3_ngzjtr.webp"
              alt="Image"
              className="mx-auto mb-[-50px]"
          />
      </div>
    </main>
  )
}