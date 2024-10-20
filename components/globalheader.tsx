"use client";

import React, { useState, useEffect } from 'react';
import AvatorProfileDropdown from '@/app/user/login/components/logout';
import { motion } from 'framer-motion';
import NavigationBurger from './NavigationMenu';

const GlobalHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // New state to track mounting

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set the window width after mounting and add event listeners
    setWindowWidth(window.innerWidth);
    setIsMounted(true); // Mark as mounted

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Conditionally apply size-based class only when the component is mounted
  const headerClass = `
    fixed top-4 left-1/2 transform -translate-x-1/2 
    bg-white rounded-full shadow-lg z-50
    transition-all duration-300 ease-in-out
    ${isScrolled ? 'py-2 px-4' : 'py-5 px-24'}
    ${isMounted && windowWidth > 1024 ? 'lg:py-3 lg:px-8' : ''}
  `;

  return (
    <motion.div>
      <header className={headerClass}>
        <div className="flex items-center justify-between space-x-4 md:space-x-8">
          <div className="flex items-center space-x-2 md:space-x-4">
            <NavigationBurger />
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <a href='/'>
                  <img 
                    src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png" 
                    alt="GDGC PCCoE Logo" 
                    className={`group-hover:rotate-12 transition-transform duration-300 ease-in-out 
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 object-contain`}
                  />
                </a>
              </div>
              <div className="hidden md:block">
                <a href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">GDGC PCCoE</a>
                <div className="text-sm text-gray-600 hidden lg:block">
                  Google Developer Student Clubs, PCCoE
                </div>
              </div>
            </div>
          </div>
          <AvatorProfileDropdown />
        </div>
      </header>
    </motion.div>
  );
};

export default GlobalHeader;
