import React from 'react';
import localFont from "next/font/local";
import AvatorProfileDropdown from "@/app/user/login/components/logout";
import "./globals.css";
import NavigationMenu from '@/components/NavigationMenu';
import { Metadata } from 'next/types';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GDGC PCCoE",
  description: "Google Developer Groups on Campus, Pimpri Chinchwad College of Engineering, Pune",
  keywords: ["Google Developer Groups", "GDGC", "PCCoE", "Pune", "tech community", "developer events"],
  authors: [{ name: "GDGC PCCoE, Pune" }],
  creator: "GDGC PCCoE",
  publisher: "Pimpri Chinchwad College of Engineering",
  openGraph: {
    title: "GDGC PCCoE | Google Developer Groups on Campus",
    description: "Join Google Developer Groups on Campus at Pimpri Chinchwad College of Engineering, Pune. Learn, connect, and grow with tech enthusiasts and industry experts.",
    url: "https://gdgcpccoe.org",
    siteName: "GDGC PCCoE",
    images: [
      {
        url: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1729245016/gdgc/123_x31ajj.webp",
        width: 1200,
        height: 675,
        alt: "GDGC PCCoE Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDGC PCCoE | Google Developer Groups on Campus",
    description: "Join Google Developer Groups on Campus at Pimpri Chinchwad College of Engineering, Pune. Learn, connect, and grow with tech enthusiasts and industry experts.",
    images: ["https://res.cloudinary.com/dfyrk32ua/image/upload/v1729245016/gdgc/123_x31ajj.webp"],
    creator: "@gdscpccoe",
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://gdgcpccoe.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <html lang="en">
      <head>
        <title>GDGC PCCoE</title>
        <meta name="description" content="Google Developer Student Clubs, Pimpri Chinchwad College of Engineering" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <header className="w-full fixed top-0 left-0 right-0 bg-white shadow-md z-20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <NavigationMenu />
              <div className="flex items-center space-x-2">
                <div>
                  <picture>
                    <img src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png" alt="GDGC PCCoE Logo" className="w-10 h-5" />
                  </picture>
                </div>
                <div>
                  <a href="/" className="text-xl font-bold text-gray-800">GDGC PCCoE</a>
                  <a href="/" className="text-sm text-gray-600 hidden md:block">
                    Google Developer Student Clubs, PCCoE
                  </a>
                </div>
              </div>
            </div>
            <AvatorProfileDropdown />
          </div>
        </header>
        <div className="pt-16  bg-gradient-to-br from-blue-200 to-purple-200">
          {children}
        </div>
      </body>
    </html>
  );
}