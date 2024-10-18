"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Skeleton } from '@/components/ui/skeleton';

type Question = {
  id: string;
  question_text: string;
  question_type: string;
  is_required: boolean;
  order_number: number;
  options?: string[];
};

type Form = {
  id: string;
  title: string;
  description?: string;
  filled: boolean;
  questions: Question[];
};

export default function FormResponses() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch('/api/forms');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setForms(data);
      } catch (e) {
        setError("Failed to fetch forms");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleSelectForm = async (formId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/forms?id=${formId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const formData = await res.json();
      setSelectedForm(formData);
      if (formData.filled) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'],
        });
      }
    } catch (e) {
      setError("Failed to fetch form details");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResponses = () => {
    if (selectedForm) {
      router.push(`/forms/${selectedForm.id}/responses`);
    }
  };

  const skeletonLoader = (
    <Skeleton className="h-10 w-full mb-4" />
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 mt-40 min-h-screen">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-gray-800">
              Loading Forms...
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx}>{skeletonLoader}</div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) return <div className="text-red-600 text-center mt-40">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8 mt-25 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-4xl font-extrabold">
            Your GDSC Forms
          </CardTitle>
          <CardDescription className="text-blue-100 mt-2">
            Select a form to view its details and responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <Select onValueChange={handleSelectForm}>
            <SelectTrigger className="w-full mb-6 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500">
              <SelectValue placeholder="Choose a form" />
            </SelectTrigger>
            <SelectContent>
              {forms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.title} {form.filled ? "(Filled)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AnimatePresence mode="wait">
            {selectedForm && (
              <motion.div
                key={selectedForm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedForm.title}</h3>
                {selectedForm.description && (
                  <p className="mb-6 text-gray-600">{selectedForm.description}</p>
                )}
                <p className="mb-4 text-lg font-medium text-gray-700">
                  Number of questions: {selectedForm.questions.length}
                </p>
                {selectedForm.filled ? (
                  <>
                    <p className="text-green-600 font-semibold mb-4">
                      You have filled this form!
                    </p>
                    <Button 
                      onClick={handleViewResponses} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                      View Responses
                    </Button>
                  </>
                ) : (
                  <p className="text-yellow-600 font-semibold">You have not filled this form yet.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}