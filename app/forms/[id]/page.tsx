import { createClient } from '@/app/utils/supabase/server'
import Form from './Form' 

export default async function FormPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: form } = await supabase
    .from('forms')
    .select('*, questions(*)')
    .eq('id', params.id)
    .single()

  if (!form) {
    return <div className="container mx-auto p-4">Form not found</div>
  }

  return <Form form={form} />
}