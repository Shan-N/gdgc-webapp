'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockIcon, MailIcon, Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred during login');
      }

      // Successful login
      router.push('/user/profile'); // Redirect to dashboard or appropriate page
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-6 px-8 pb-20 gap-16 sm:p-6">
      <Card className="w-full max-w-md mx-auto shadow-lg relative z-10 bg-white bg-opacity-80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">GDGC PCCoE Login</CardTitle>
          <p className='text-sm text-muted-foreground text-center'>You&apos;re about to take a head first dive into innovation, creativity, and collaboration.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="email" name="email" type="email" placeholder="you@pccoepune.org" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10" required />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2Icon className="animate-spin mr-2" size={18} /> : null}
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <p className='text-center mb-4'> -------- or -------- </p>
        <CardFooter className="flex flex-col items-center space-y-2 pt-0">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/user/signup')}
          >
            Sign Up
          </Button>
          <Alert variant="default" className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
            <AlertDescription>
              Unable to access? Contact the team at <a href="mailto:help@gdgcpccoe.org" className="font-semibold hover:underline">help@gdgcpccoe.org</a>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;