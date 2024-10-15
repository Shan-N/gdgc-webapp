import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventRegistrationForm from '@/app/formss/components/forms';
import ActiveRegistrations from '@/app/formss/components/active-registrations';
import { Calendar } from "lucide-react";
import AHHHHBACKKKKK from '@/components/back-button';

export default function EventRegistrationPage() {
  return (
    <div className="container mx-auto p-4 space-y-6 mt-6">
      <AHHHHBACKKKKK />
      <h1 className="text-4xl font-bold text-center">Event Registration</h1>
      <div className="hidden lg:flex space-x-6">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" />
              Register for Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventRegistrationForm />
          </CardContent>
        </Card>
        
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Active Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveRegistrations />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="register" className="lg:hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" />
                Register for Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventRegistrationForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveRegistrations />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}