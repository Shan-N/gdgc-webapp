"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailIcon, CheckCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignUpSuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <CheckCircleIcon className="mr-2 text-green-500" size={28} />
            Registration Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            Thank you for signing up! We&apos;ve sent a confirmation email to your address. 
            Please check your inbox and click the verification link to activate your account.
          </p>
          <div className="flex items-center justify-center mb-6">
            <MailIcon className="mr-2 text-blue-500" size={24} />
            <span className="text-lg font-semibold">Check your email</span>
          </div>
          <Button 
            onClick={() => router.push('/user/login')}
            className="w-full"
          >
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpSuccessPage;