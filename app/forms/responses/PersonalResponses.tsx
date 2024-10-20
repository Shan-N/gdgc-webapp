"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, ClipboardList, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

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
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const formData = await res.json();
      setSelectedForm(formData);
      if (formData.filled) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E0BBE4', '#957DAD', '#D291BC'], // Lighter confetti colors
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100 via-transparent to-purple-100 opacity-70" />
        <div className="relative z-10 container mx-auto p-8 pt-40">
          <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/90">
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100 via-transparent to-purple-100 opacity-70" />
      
      <div className="relative z-10 container mx-auto p-8 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-4xl mx-auto overflow-hidden backdrop-blur-sm bg-white/95 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-pink-200 to-purple-300 text-gray-800 p-8">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList className="w-8 h-8 text-gray-600" />
                <CardTitle className="text-3xl font-semibold">Your Forms</CardTitle>
              </div>
              <CardDescription className="text-gray-600 text-lg">
                Manage your form responses
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              <Select onValueChange={handleSelectForm}>
                <SelectTrigger className="w-full h-12 text-lg bg-white shadow-sm border-gray-200">
                  <SelectValue placeholder="Choose a form to view" />
                </SelectTrigger>
                <SelectContent>
                  {forms.map((form) => (
                    <SelectItem 
                      key={form.id} 
                      value={form.id}
                      className="flex items-center justify-between"
                    >
                      <span>{form.title}</span>
                      {form.filled && (
                        <span className="ml-2 text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Completed
                        </span>
                      )}
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
                    className="space-y-6"
                  >
                    <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm">
                      <h3 className="text-2xl font-bold text-gray-700">
                        {selectedForm.title}
                      </h3>
                      {selectedForm.description && (
                        <p className="text-gray-600">{selectedForm.description}</p>
                      )}
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <ClipboardList className="w-5 h-5" />
                        <span>{selectedForm.questions.length} questions</span>
                      </div>
                    </div>

                    {selectedForm.filled ? (
                      <motion.div 
                        className="text-center space-y-4"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        <Button
                          onClick={handleViewResponses}
                          className="px-8 py-6 text-lg bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          View Your Responses
                          <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                      </motion.div>
                    ) : (
                      <p className="text-center text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                        You haven&apos;t filled this form yet
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
