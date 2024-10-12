'use client';

import React, { useState, useEffect } from 'react';
import IntroAnimation from '@/components/intro-animation';
import IntroParallax from '@/components/intro-parallax';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Lenis from 'lenis'
import styles from './page.module.css'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showIntroduction, setShowIntroduction] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroduction(false);
    }, 5000);

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
    <main className="items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      {showIntroduction && <IntroAnimation />}
      <div className={`transition-opacity p-4 mt-48 duration-500 ${showIntroduction ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-3xl font-bold text-center text-gray-800">Welcome to GDGC x PCCoE</h1>
        <p className="text-center text-gray-600">Google Developer Group on Campus, Pimpri Chinchwad College of Engineering</p>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Join Us</CardTitle>
            <CardDescription>Be a part of our growing community</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Ready to embark on an exciting journey of learning and innovation? Join our community by filling out the form!</p>
            <Link href="/forms">
              <Button className="w-full">Go to Forms</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Check out the Team</CardTitle>
            <CardDescription> Meet the people behind the magic </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4"> Find  out more about the team members who make this community thrive! </p>
            <Link href="/teams">
              <Button className="w-full">Go to Teams</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2 md:mt-2">
        <main className={styles.main1}>
          <IntroParallax />
        </main>
      </div>
    </main>
  );
}