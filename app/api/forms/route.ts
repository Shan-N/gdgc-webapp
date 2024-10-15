import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

// Define the Form interface
interface Form {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question_text: string;
    question_type: string;
    is_required: boolean;
    order_number: number;
    options: string[];
  }[];
}

// Define an interface for the form with the 'filled' property
interface FormWithFilledStatus extends Form {
  filled: boolean;
}

export async function GET(request: Request) {
  const supabase = createClient()

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Extract the form ID from the request URL
  const { searchParams } = new URL(request.url)
  const formId = searchParams.get('id')

  const selectQuery = `
    id,
    title,
    description,
    questions (
      id,
      question_text,
      question_type,
      is_required,
      order_number,
      options
    )
  `

  const { data: forms, error: formsError } = formId
    ? await supabase.from('forms').select(selectQuery).eq('id', formId).single()
    : await supabase.from('forms').select(selectQuery)

  if (formsError) {
    return NextResponse.json({ error: formsError.message }, { status: 500 })
  }

  // Fetch the 'filled' status for each form
  const fetchFilledStatus = async (formIds: string[]): Promise<Record<string, boolean>> => {
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('form_id')
      .in('form_id', formIds)
      .eq('respondent_id', user.id)

    if (responsesError) {
      console.error('Error fetching responses:', responsesError)
      return {}
    }

    return responses.reduce((acc: Record<string, boolean>, response) => {
      acc[response.form_id] = true
      return acc
    }, {})
  }

  let formsWithFilledStatus: FormWithFilledStatus | FormWithFilledStatus[];

  if (Array.isArray(forms)) {
    const formIds = forms.map(form => form.id)
    const filledStatus = await fetchFilledStatus(formIds)
    formsWithFilledStatus = forms.map(form => ({
      ...form,
      filled: !!filledStatus[form.id]
    }))
  } else if (forms) {
    const filledStatus = await fetchFilledStatus([forms.id])
    formsWithFilledStatus = {
      ...forms,
      filled: !!filledStatus[forms.id]
    }
  } else {
    formsWithFilledStatus = []
  }

  return NextResponse.json(formsWithFilledStatus)
}