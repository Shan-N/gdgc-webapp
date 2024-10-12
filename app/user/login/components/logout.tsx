"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

const AvatorProfileDropdown: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const getProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? null);
      
      // Fetch the user's profile to get the avatar URL
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
  }, [supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/user/login');
    }
  };

  const handleProfileClick = () => {
    router.push('/user/profile');
  };

  const getInitials = (email: string | null) => {
    if (!email) return '';
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const isLoggedIn = !!email;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
      {isLoggedIn ? (
      <Button 
        variant="ghost" 
        className="px-4 py-2 rounded-lg group relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
      >
        {/* Abstract background shapes */}
        <div className="absolute inset-0 opacity-75 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 transform -skew-y-12"></div>
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-red-500 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-yellow-400 transform skew-x-12"></div>
          <div className="absolute top-1/2 right-1/4 w-1/3 h-1/3 bg-green-500 transform rotate-45"></div>
        </div>
        
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-300 ease-in-out"></div>
        
        {/* Avatar */}
        <Avatar className="h-12 w-12 rounded-full inline-block relative z-10 ring-2 ring-white transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-12">
          <AvatarImage src={avatarUrl || undefined} alt="Profile" className="object-cover" />
          <AvatarFallback className="bg-gray-200 text-gray-700">{getInitials(email)}</AvatarFallback>
        </Avatar>   
      </Button>
      ) : ( 
      <a href='/user/login'>
        <Button variant="outline" className="px-4 py-2 rounded">
          Login
        </Button>
      </a>
      )}
      </DropdownMenuTrigger>
      {isLoggedIn && (
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={handleProfileClick}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default AvatorProfileDropdown;