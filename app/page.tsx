'use client';

import React, { useState, useEffect } from 'react';
import IntroAnimation from '@/components/intro-animation';
import Lenis from 'lenis'
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
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [introFinished, setIntroFinished] = useState(false); // new state variable

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroduction(false);
      setIntroFinished(true);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);


  return (
      <main className="items-center justify-items-center min-h-screen  font-[family-name:var(--font-geist-sans)]">
        {showIntroduction && <IntroAnimation />}

        <div className="relative">
          <WavyBackground className="pb-36" />
          <div className={`transition-opacity p-4 duration-500 ${showIntroduction ? 'opacity-0' : 'opacity-100'}`}>
            <div className={bebasNeue.className}>
              <h1 className="mb-4 text-5xl text-center z-20 font-normal tracking-wider leading-none text-gray-900 md:text-6xl lg:text-[92px]">Welcome to GDGC, PCCoE</h1>
            </div>
            <p className="text-center z-20 text-gray-600 mb-6 text-lg">Google Developer Group on Campus, Pimpri Chinchwad College of Engineering, Pune</p>
          </div>
        </div>
        <div className="mt-6 pb-6 overflow-hidden">
          {introFinished && (
            <>
              <DiscordPromoCard />
              <TeamCard />
              <RFIDCard />
              <TeamCardWebapp />
              <EventsPromoCard />
            </>
          )}
        </div>
        {/*
        import { FieldsCovered } from '@/components/FieldsCovered';
        <FieldsCovered />

        import styles from './page.module.css'
        import IntroParallax from '@/components/intro-parallax';
          <div className="mt-2 md:mt-2">
            <main className={styles.main1}>
              <IntroParallax />
            </main>
          </div>
        */}
      </main>
  );
}