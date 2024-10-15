'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LockIcon, MailIcon, Loader2Icon, UserIcon, PhoneIcon, HashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email.endsWith('@gmail.com')) {
      setEmailError('Only emails ending with @pccoepune.org are allowed');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string) => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setPhoneError('Phone number must be exactly 10 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const phone = formData.get('phone_number') as string;

    if (!validateEmail(email) || !validatePhone(phone)) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          full_name: formData.get('full_name'),
          current_year: formData.get('current_year'),
          current_branch: formData.get('current_branch'),
          phone_number: formData.get('phone_number'),
          prn: formData.get('prn'),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred during signup');
      }

      router.push('/user/signup/SignUpConfirmation');
    } catch (error) {
      console.error(error);
      setGeneralError((error as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">GDGC PCCoE Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="full_name" name="full_name" placeholder="John Doe" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@pccoepune.org" 
                  className="pl-10" 
                  required 
                  onChange={(e) => validateEmail(e.target.value)}
                />
              </div>
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_year">Current Year</Label>
              <Select name="current_year" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_branch">Current Branch</Label>
              <Select name="current_branch" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Computer Engineering (AIML Edition)">Computer Engineering (AIML Edition)</SelectItem>
                  <SelectItem value="Computer Engineering (Regional Edition)">Computer Engineering (Regional Edition)</SelectItem>
                  <SelectItem value="Electronics and Telecommunication">Electronics and Telecommunication</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  id="phone_number" 
                  name="phone_number" 
                  type="tel" 
                  placeholder="1234567890" 
                  className="pl-10" 
                  required 
                  onChange={(e) => validatePhone(e.target.value)}
                />
              </div>
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prn">PRN (Permanent Registration Number)</Label>
              <div className="relative">
                <HashIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="prn" name="prn" placeholder="12345678901" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10" required />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || !!emailError || !!phoneError}
            >
              {loading ? <Loader2Icon className="animate-spin mr-2" /> : null}
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <p className='text-center mb-4'> -------- or -------- </p>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/user/login')}
          >
            Already have an account? Log in
          </Button>
          <Alert variant="default" className="mt-4">
            <AlertDescription>
              Need help? Contact the team at <a href="mailto:help@gdgcpccoe.org" className="font-semibold hover:underline">help@gdgcpccoe.org</a>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUpForm;