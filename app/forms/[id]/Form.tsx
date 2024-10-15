'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

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

export default function Form({ form }: FormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [justSubmitted, setJustSubmitted] = useState(false)
  
  const supabase = createClient()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasSubmitted) {
      setSubmitMessage('You have already submitted this form.')
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-300 to-blue-500 text-primary-foreground">
            <CardTitle className="text-3xl font-bold">{form.title}</CardTitle>
            <CardDescription className="text-primary-foreground/80">{form.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {hasSubmitted && !justSubmitted ? (
                <motion.p
                  key="already-submitted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 text-center font-semibold flex items-center justify-center"
                >
                  <CheckCircle className="mr-2" /> You have already submitted this form.
                </motion.p>
              ) : justSubmitted ? (
                <motion.p
                  key="just-submitted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 text-center font-semibold flex items-center justify-center"
                >
                  <CheckCircle className="mr-2" /> {submitMessage}
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {form.questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor={question.id} className="font-medium">
                        {question.question_text}
                        {question.is_required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {question.question_type === 'text' && (
                        <Input
                          id={question.id}
                          type="text"
                          required={question.is_required}
                          value={answers[question.id] || ''}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-full"
                        />
                      )}
                      {question.question_type === 'textarea' && (
                        <Textarea
                          id={question.id}
                          required={question.is_required}
                          value={answers[question.id] || ''}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-full"
                        />
                      )}
                      {question.question_type === 'select' && question.options && (
                        <Select
                          onValueChange={(value) => handleInputChange(question.id, value)}
                          required={question.is_required}
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
                  <Button
                    type="submit"
                    className="w-full bg-blue-300 hover:bg-blue-400"
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
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
          {!hasSubmitted && !justSubmitted && submitMessage && (
            <CardFooter className="bg-gray-50 border-t">
              <p className="w-full text-center font-medium text-red-600 flex items-center justify-center">
                <AlertCircle className="mr-2" /> {submitMessage}
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

async function getCurrentUserId(supabase: SupabaseClient): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.id
}