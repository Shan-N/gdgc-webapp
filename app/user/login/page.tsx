'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockIcon, MailIcon, Loader2Icon } from 'lucide-react';
import { login } from "./actions";


const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      await login(formData);
    } catch (error) {
      console.error(error);
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
        <CardFooter className="flex flex-col items-center space-y-2 pt-0">
          <Alert variant="default" className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
            <AlertDescription>
              Unable to access? Contact the team at <a href="mailto:gdgc@pccoepune.org" className="font-semibold hover:underline">gdgc@pccoepune.org</a>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;