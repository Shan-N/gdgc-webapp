"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockIcon, Loader2Icon } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      const email = searchParams.get('email');
      if (email) {
        supabase.auth.verifyOtp({ token, type: 'recovery', email })
          .then(({ error }) => {
            if (error) {
              console.error('Token verification error:', error);
              setError('Invalid or expired reset token. Please try resetting your password again.');
            }
          });
      } else {
        setError('Invalid or missing email. Please try resetting your password again.');
      }
    } else {
      setError('Invalid or missing reset token. Please try resetting your password again.');
    }
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
  
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Password Reset Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Your password has been successfully reset. You can now log in with your new password.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.href = '/user/login'}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-full max-w-md m-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  id="newPassword" 
                  type="password" 
                 value={newPassword} 
                 onChange={(e) => setNewPassword(e.target.value)} 
                 placeholder="Enter new password" 
                 className="pl-10" 
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" size={18} /> : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetPage;