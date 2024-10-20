'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: string
  question_text: string
  question_type: string
  is_required: boolean
  options?: string[]
}

interface Form {
  id: string
  title: string
  description: string
  questions: Question[]
}

interface FormProps {
  form: Form
}

const QUESTIONS_PER_PAGE = 3

const FormSection = ({ 
  questions, 
  answers, 
  handleInputChange 
}: { 
  questions: Question[]
  answers: Record<string, string>
  handleInputChange: (questionId: string, value: string) => void 
}) => {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-3"
        >
          <Label htmlFor={question.id} className="text-lg font-medium flex items-start gap-2">
            {question.question_text}
            {question.is_required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </Label>
          {question.question_type === 'text' && (
            <Input
              id={question.id}
              type="text"
              required={question.is_required}
              value={answers[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-400"
            />
          )}
          {question.question_type === 'textarea' && (
            <Textarea
              id={question.id}
              required={question.is_required}
              value={answers[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-400 min-h-[120px]"
            />
          )}
          {question.question_type === 'select' && question.options && (
            <Select
              onValueChange={(value) => handleInputChange(question.id, value)}
              required={question.is_required}
              value={answers[question.id]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </motion.div>
      ))}
    </div>
  )
}


export default function Form({ form }: FormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  
  const supabase = createClient()

  const totalPages = Math.ceil(form.questions.length / QUESTIONS_PER_PAGE)
  const currentQuestions = form.questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  )

  useEffect(() => {
    checkPreviousSubmission(supabase, form.id)
  }, [form.id, supabase])

  const checkPreviousSubmission = async (supabase: SupabaseClient, formId: string) => {
    try {
      const user = await getCurrentUserId(supabase)
      const { data, error } = await supabase
        .from('responses')
        .select('id')
        .eq('form_id', formId)
        .eq('respondent_id', user)
        .maybeSingle()

      if (error) throw error

      setHasSubmitted(!!data)
    } catch (error) {
      console.error('Error checking previous submission:', error)
      toast({
        title: "Error",
        description: "Unable to check previous submissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateRequiredFields = () => {
    const currentQuestions = form.questions.slice(
      currentPage * QUESTIONS_PER_PAGE,
      (currentPage + 1) * QUESTIONS_PER_PAGE
    )
    
    const unansweredRequired = currentQuestions.find(
      question => question.is_required && !answers[question.id]
    )
    
    return !unansweredRequired
  }

  const handleNextPage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    if (validateRequiredFields()) {
      setCurrentPage(prev => prev + 1)
    } else {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handlePrevPage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    setCurrentPage(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasSubmitted) {
      setSubmitMessage('You have already submitted this form.')
      return
    }

    const allRequiredAnswered = form.questions.every(
      question => !question.is_required || answers[question.id]
    )

    if (!allRequiredAnswered) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const respondentId = await getCurrentUserId(supabase)
      
      const { data, error } = await supabase
        .from('responses')
        .insert({ 
          form_id: form.id,
          respondent_id: respondentId
        })
        .select()
        .single()

      if (error) throw error

      const answersData = Object.entries(answers).map(([questionId, answerText]) => ({
        response_id: data.id,
        question_id: questionId,
        answer_text: answerText,
        answer_json: {},
        custom_fields: {}
      }))

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersData)

      if (answersError) throw answersError

      setSubmitMessage('Form submitted successfully!')
      setAnswers({})
      setHasSubmitted(true)
      setJustSubmitted(true)
      toast({
        title: "Success",
        description: "Your form has been submitted successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Error submitting form. Please try again.')
      toast({
        title: "Error",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 from-pink-200 via-transparent to-purple-200 opacity-70" />
      
      <div className="relative z-10 mx-auto px-2 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden rounded-[24px] bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-200 to-purple-200 p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{form.title}</h2>
                <CardDescription className="text-white/90 text-lg">
                  {form.description}
                </CardDescription>
                {!hasSubmitted && !justSubmitted && (
                  <div className="mt-6 space-y-2">
                    <Progress 
                      value={((currentPage + 1) / totalPages) * 100} 
                      className="h-2 bg-white/20"
                    />
                    <p className="text-white/90 text-sm">
                      Page {currentPage + 1} of {totalPages}
                    </p>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {hasSubmitted && !justSubmitted ? (
                    <motion.div
                      key="already-submitted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold">Already Submitted</h3>
                      <p className="text-gray-600">You have already submitted this form.</p>
                    </motion.div>
                  ) : justSubmitted ? (
                    <motion.div
                      key="just-submitted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold">Thank You!</h3>
                      <p className="text-gray-600">{submitMessage}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <FormSection
                        questions={currentQuestions}
                        answers={answers}
                        handleInputChange={handleInputChange}
                      />
                      
                      <div className="flex justify-between items-center pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevPage}
                          disabled={currentPage === 0}
                          className="w-32"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>

                        {currentPage === totalPages - 1 ? (
                          <Button
                            type="submit"
                            className="w-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              'Submit'
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleNextPage}
                            className="w-32 bg-blue-600 hover:bg-blue-700"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </CardContent>

              {!hasSubmitted && !justSubmitted && submitMessage && (
                <CardFooter className="bg-gray-50 border-t p-4">
                  <p className="w-full text-center font-medium text-red-600 flex items-center justify-center">
                    <AlertCircle className="mr-2" /> {submitMessage}
                  </p>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

async function getCurrentUserId(supabase: SupabaseClient): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  return user.id
}