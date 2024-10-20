"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, Loader2Icon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from '@/app/utils/supabase/client';
import { Input } from "@/components/ui/input";

const SignUpConfirmation: React.FC = () => {
  const [token, setToken] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at) {
        router.push('/');
      }
    };

    checkVerification();
  }, [searchParams, router, supabase.auth]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newToken = [...token];
      newToken[index] = value;
      setToken(newToken);

      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullToken = token.join('');
    if (fullToken.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setVerifying(true);
    setError('');

    if (!email) {
      setError('Email not found. Please try signing up again.');
      setVerifying(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fullToken, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/user/profile?verified=true');
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center"> Verify your email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a 6-digit verification code to
            <br />
            <span className="font-semibold">{email || 'your email'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!success ? (
            <>
              <div className="flex justify-center space-x-2">
                {token.map((_, index) => (
                  <Input
                    key={index}
                    type="tel"
                    maxLength={1}
                    value={token[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    className="w-12 h-12 text-2xl text-center border-2 border-gray-200 rounded-md"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
              <Button
                type="button"
                onClick={handleVerify}
                className="w-full"
                disabled={verifying}
              >
                {verifying ? (
                  <Loader2Icon className="animate-spin mr-2" />
                ) : (
                  <CheckCircleIcon className="mr-2" />
                )}
                Verify Email
              </Button>
            </>
          ) : (
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                Your email has been successfully verified! You will be redirected to your profile page in 3 seconds.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpConfirmation;