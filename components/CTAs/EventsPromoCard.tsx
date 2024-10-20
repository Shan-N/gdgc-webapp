import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Play } from 'lucide-react';
import { pastEvents, PastEvent } from '@/datahouse/pastEvents';

{/*
const ModernEventCard = ({ title, date, description }: UpcomingEvent) => (
  <motion.div 
    className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white border-opacity-10"
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-white text-opacity-70 mt-1">{description}</p>
      </div>
      <motion.button 
        className="text-white opacity-50 hover:opacity-100 transition-opacity mt-1"
        whileHover={{ x: 5 }}
      >
        <ArrowRight size={20} />
      </motion.button>
    </div>
    <div className="flex items-center text-sm mt-2 text-white text-opacity-70">
      <Calendar className="w-4 h-4 mr-2" />
      <span>{date}</span>
    </div>
  </motion.div>
);
*/}

const PastEventCard = ({ title, date, recordingUrl }: PastEvent) => (
  <motion.div 
    className="flex justify-between items-center bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-3 mb-3 border border-white border-opacity-10"
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    transition={{ duration: 0.2 }}
  >
    <div>
      <h3 className="font-medium text-sm">{title}</h3>
      <div className="flex items-center text-xs mt-1 text-white text-opacity-70">
        <Clock className="w-3 h-3 mr-1" />
        <span>{date}</span>
      </div>
    </div>
    {recordingUrl && (
      <motion.a 
        href={recordingUrl}
        className="text-white opacity-50 hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
        title="Watch recording"
      >
        <Play size={16} />
      </motion.a>
    )}
  </motion.div>
);

const ModernEventsPromoCard = () => {
  return (
    <div className="flex justify-center items-start p-4">
      <div className="relative max-w-4xl w-full">
        {/*
        <motion.div 
          className="relative bg-gradient-to-br from-pink-700 to-pink-600 text-white rounded-3xl shadow-2xl overflow-hidden w-full border border-pink-500"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-white text-opacity-70">
                Join us for these exciting events and stay at the forefront of innovation.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <ModernEventCard key={event.id} {...event} />
              ))}
            </div>

            <motion.button 
              className="mt-8 bg-white text-gray-900 font-medium py-2 px-6 rounded-full hover:bg-opacity-90 transition duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Events
              <ArrowRight className="ml-2" size={20} />
            </motion.button>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20 -ml-32 -mb-32"></div>
        </motion.div>
        */}    
        
        <motion.div
          className="relative mt-6 bg-gradient-to-br from-pink-700 to-pink-600 text-white rounded-3xl shadow-2xl overflow-hidden w-full border border-pink-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Past Events</h3>
            {pastEvents.map((event) => (
              <PastEventCard key={event.id} {...event} />
            ))}
            <motion.button 
              className="mt-4 text-white text-opacity-70 hover:text-opacity-100 font-medium py-2 px-4 rounded-full border border-white border-opacity-20 hover:border-opacity-40 transition duration-300 flex items-center justify-center w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Past Events
              <ArrowRight className="ml-2" size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernEventsPromoCard;