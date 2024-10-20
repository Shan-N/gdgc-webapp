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
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Loading Responses...
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="mb-6">
                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-100" />
                <Skeleton className="h-10 w-full bg-gray-50" />
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
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-md">
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
    <div className="p-8 pt-40 min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="text-center mb-8 mx-auto max-w-4xl">
        <Button 
          onClick={() => history.back()} 
          className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back to Forms
        </Button>
      </div>

      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-gray-100 bg-gradient-to-r from-pink-200 to-purple-300 text-gray-800 p-8">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Form Responses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {responses.length === 0 ? (
            <p className="text-gray-600 text-center font-semibold">
              No responses found for this form.
            </p>
          ) : (
            <div className="space-y-6">
              {responses.map((response, responseIndex) => (
                <motion.div
                  key={response.id}
                  className="bg-gray-50 p-8 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: responseIndex * 0.1 }}
                >
                  <p className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <MessageCircle className="mr-2" />
                    Submitted at: {new Date(response.submitted_at).toLocaleString()}
                  </p>

                  <div className="space-y-6 divide-y divide-gray-200">
                    {response.answers.map((answer, index) => (
                      <motion.div
                        key={index}
                        className="py-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-start mb-2">
                          <HelpCircle className="mr-3 text-gray-600" />
                          <p className="text-lg font-medium text-gray-800">{answer.question.question_text}</p>
                        </div>
                        <div className="pl-8">
                          <p className="text-gray-700 bg-gray-100 p-4 rounded-md">
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
