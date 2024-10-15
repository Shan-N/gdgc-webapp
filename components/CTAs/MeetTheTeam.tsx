import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react'

interface TeamMember {
  avatar_url: string | null; // Allow avatar_url to be null
  username: string;
}

const TeamCard = () => {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);

  React.useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
    fetchTeamMembers();
  }, []);

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div 
        className="relative bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center p-8">
          <div className="flex-1 z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Meet Our Team
            </motion.h2>
            <motion.p 
              className="mb-6 text-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Discover the passionate minds behind our innovation!
            </motion.p>
            <a href='/teams'>
                <motion.button 
                className="bg-white text-teal-600 font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                <Users className="inline-block mr-2" />
                View Team
                </motion.button>
            </a>
          </div>
          <motion.div 
            className="mt-8 md:mt-0 md:ml-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4">
              {teamMembers.filter(member => member.avatar_url !== null).slice(0, 6).map((member, index) => {
                return (
                  <div key={index} className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center">
                    <picture>
                      <img 
                        src={member.avatar_url || 'avatar'}
                        alt={member.username}
                        className="w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                );
              }).concat(Array(6 - teamMembers.filter(member => member.avatar_url !== null).slice(0, 6).length).fill(0).map((_, index) => {
                return (
                  <div key={index} className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full bg-gray-300 rounded-full" />
                  </div>
                );
              }))}
            </div>
          </motion.div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full h-7 md:h-16" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H 0V120Z" fill="#F7F7F7" />
        </svg>
      </motion.div>
    </div>
  );
};

export default TeamCard;