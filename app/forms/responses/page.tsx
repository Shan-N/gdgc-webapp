import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PersonalResponses from '@/app/forms/responses/PersonalResponses';
import { createClient } from '@/app/utils/supabase/server'

const LoginPage = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>No active session</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p>Please sign in to fill the responses.</p>
            <a href='/user/login'><Button>Sign In</Button></a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PersonalResponses />;
};

export default LoginPage;