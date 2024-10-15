'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle, MessageCircle } from 'lucide-react';

type Answer = {
  question: {
    question_text: string;
    question_type: string;
  };
  answer_text: string | null;
  answer_json: Record<string, JSON> | null;
};

type Response = {
  id: string;
  submitted_at: string;
  answers: Answer[];
};

export default function FormResponsesPage() {
  const { id } = useParams();
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`/api/forms/${id}/responses`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setResponses(data);
      } catch (e) {
        setError('Failed to fetch responses');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchResponses();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 mt-20">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
          <CardHeader className="bg-blue-100">
            <CardTitle className="text-3xl font-extrabold text-blue-600">
              Loading Responses...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="mb-6">
                <Skeleton className="h-6 w-3/4 mb-2 bg-blue-100" />
                <Skeleton className="h-10 w-full bg-blue-50" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 mt-20 text-center">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
          <CardContent className="p-6">
            <p className="text-red-500 font-semibold flex items-center justify-center">
              <HelpCircle className="mr-2" /> Error: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-8 mt-20 min-h-screen">
        <div className="text-center my-6">
            <Button 
            onClick={() => history.back()} 
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
            >
            <ChevronLeft className="mr-2" /> Back to Forms
            </Button>
        </div>
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl">
        <CardHeader className="bg-blue-100">
          <CardTitle className="text-3xl font-extrabold text-blue-600">
            Form Responses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {responses.length === 0 ? (
            <p className="text-blue-600 text-center font-semibold">No responses found for this form.</p>
          ) : (
            <div className="space-y-8">
              {responses.map((response, responseIndex) => (
                <motion.div
                  key={response.id}
                  className="bg-blue-50 p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: responseIndex * 0.1 }}
                >
                  <p className="font-semibold text-blue-700 mb-4 flex items-center">
                    <MessageCircle className="mr-2" />
                    Submitted at: {new Date(response.submitted_at).toLocaleString()}
                  </p>
                  <div className="space-y-6">
                    {response.answers.map((answer, index) => (
                      <motion.div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <p className="text-lg font-medium text-blue-800 mb-2 flex items-start">
                          <HelpCircle className="mr-2 mt-1 flex-shrink-0" />
                          <span>{answer.question.question_text}</span>
                        </p>
                        <div className="pl-7">
                          <p className="text-blue-600 bg-blue-50 p-3 rounded-md">
                            {answer.answer_text || JSON.stringify(answer.answer_json, null, 2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}