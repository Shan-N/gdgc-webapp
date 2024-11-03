import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen} from 'lucide-react';

const OurBlogs = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <motion.div 
        className="relative bg-[#f75a8c] text-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full"
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
              Read Our Blogs
            </motion.h2>
            <motion.p 
              className="mb-6 text-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              We post goofy ass blogs! please read them!!
            </motion.p>
            <a href='/blog'>
              <motion.button 
                className="bg-white text-[#f75a8c] font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="inline-block mr-2" />
                View Blogs
              </motion.button>
            </a>
          </div>
          <motion.div 
            className="mt-8 md:mt-0 md:absolute md:-right-16 md:top-10 md:transform md:-translate-y-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >

          </motion.div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-7 md:h-16" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" fillOpacity="0.1"/>
        </svg>
      </motion.div>
    </div>
  );
};

export default OurBlogs;