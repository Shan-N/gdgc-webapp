'use client';

import React, { useState, useEffect } from 'react';
import IntroAnimation from '@/components/intro-animation';
import Lenis from 'lenis';
import DiscordPromoCard from '@/components/CTAs/Discord';
import TeamCard from '@/components/CTAs/MeetTheTeam';
import RFIDCard from '@/components/CTAs/RFIDCard';
import TeamCardWebapp from '@/components/CTAs/TeamBehindWebapp';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Bebas_Neue } from "next/font/google";
import EventsPromoCard from '@/components/CTAs/EventsPromoCard';

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
});

export default function Home() {
  const [animationState, setAnimationState] = useState({
    showIntro: true,
    introFinished: false,
    mainContentVisible: false
  });

  // Handle the intro animation sequence
  useEffect(() => {
    // Start fading in main content slightly before intro ends
    const mainContentTimer = setTimeout(() => {
      setAnimationState(prev => ({ ...prev, mainContentVisible: true }));
    }, 3800); // 400ms before intro ends

    // Handle intro completion
    const introTimer = setTimeout(() => {
      setAnimationState(prev => ({ ...prev, showIntro: false, introFinished: true }));
    }, 4200);

    return () => {
      clearTimeout(mainContentTimer);
      clearTimeout(introTimer);
    };
  }, []);

  // Initialize smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      {/* Intro Animation Layer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        animationState.showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {animationState.showIntro && <IntroAnimation />}
      </div>

      {/* Main Content Layer */}
      <div className={`relative w-full transition-all duration-1000 ${
        animationState.mainContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Wavy Background Section */}
        <div>
          <WavyBackground className="pb-36" />
          <div className="p-4">
            <div className={bebasNeue.className}>
              <h1 className="mb-4 text-5xl text-center z-20 font-normal tracking-wider leading-none text-gray-900 md:text-6xl lg:text-[92px]">
                Welcome to GDGC, PCCoE
              </h1>
            </div>
            <p className="text-center z-20 text-gray-600 mb-6 text-lg">
              Google Developer Group on Campus, Pimpri Chinchwad College of Engineering, Pune
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className={`mt-6 pb-6 transition-all duration-1000 ${
          animationState.introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <DiscordPromoCard />
          <TeamCard />
          <RFIDCard />
          <TeamCardWebapp />
          <EventsPromoCard />
        </div>
      </div>
    </main>
  );
}