import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface FloatingImageProps {
  src: string;
  alt: string;
  className: string;
}

const FloatingImage: React.FC<FloatingImageProps> = ({ src, alt, className }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`absolute ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    whileHover={{ scale: 1.05, rotate: "-3deg" }}
  />
);

const EventPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        className="relative bg-gray-800 text-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="relative h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
          <img src="/api/placeholder/1200/800" alt="Event background" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 p-8 z-20">
            <h1 className="text-4xl font-bold mb-2">Tech Summit 2024</h1>
            <p className="text-xl text-gray-300">Shaping the Future of Technology</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 relative">
          {/* Floating Images */}
          <FloatingImage src="/api/placeholder/200/200" alt="Speaker 1" className="top-4 right-4 w-24 h-24 rounded-full shadow-lg" />
          <FloatingImage src="/api/placeholder/200/200" alt="Tech gadget" className="bottom-1/4 -right-12 w-32 h-32 rounded-lg shadow-lg rotate-12" />
          <FloatingImage src="/api/placeholder/200/200" alt="Conference hall" className="top-1/3 -left-16 w-40 h-28 rounded-lg shadow-lg -rotate-6" />

          {/* Event Details */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Calendar className="mr-2" size={20} />
              <span>July 15-17, 2024</span>
            </div>
            <div className="flex items-center mb-4">
              <Clock className="mr-2" size={20} />
              <span>9:00 AM - 6:00 PM (PST)</span>
            </div>
            <div className="flex items-center mb-4">
              <MapPin className="mr-2" size={20} />
              <span>San Francisco Convention Center</span>
            </div>
            <div className="flex items-center mb-4">
              <Users className="mr-2" size={20} />
              <span>Expected attendance: 5000+</span>
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About the Event</h2>
            <p className="text-gray-300 mb-4">
              Join us for the most anticipated tech event of the year! Tech Summit 2024 brings together industry leaders, innovators, and visionaries to explore cutting-edge technologies and shape the future of the digital landscape.
            </p>
            <p className="text-gray-300 mb-4">
              From AI and machine learning to blockchain and quantum computing, dive deep into the technologies that are revolutionizing our world. Network with peers, attend hands-on workshops, and gain insights from world-renowned speakers.
            </p>
          </div>

          {/* Key Highlights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Key Highlights</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li>Keynote speeches from tech giants</li>
              <li>Interactive panel discussions</li>
              <li>Hands-on workshops and tech demos</li>
              <li>Startup showcase and pitch competition</li>
              <li>Networking events and afterparties</li>
            </ul>
          </div>

          {/* Featured Speakers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Featured Speakers</h2>
            <div className="flex flex-wrap -mx-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1/2 sm:w-1/4 px-2 mb-4">
                  <img src={`/api/placeholder/150/150`} alt={`Speaker ${i}`} className="w-full h-auto rounded-lg mb-2" />
                  <p className="font-semibold">Speaker Name</p>
                  <p className="text-sm text-gray-400">Company / Position</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration CTA */}
          <div className="text-center mb-8">
            <motion.button
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </motion.button>
            <p className="mt-2 text-gray-400">Limited spots available. Don&apos;t miss out!</p>
          </div>

          {/* Social Media & Links */}
          <div className="flex justify-center space-x-4">
            <motion.a href="#" whileHover={{ scale: 1.2 }} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.2 }} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </motion.a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 p-4 text-center">
          <p className="text-gray-400">© 2024 Tech Summit. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mr-4">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventPage;