
import { createClient } from '@/app/utils/supabase/server'
import Form from './Form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function FormPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: form } = await supabase
    .from('forms')
    .select('*, questions(*)')
    .eq('id', params.id)
    .single()

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
            <p>Please sign in to fill the form.</p>
            <a href='/user/login'><Button>Sign In</Button></a>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!form) {
    return <div className="container mx-auto p-4">Form not found</div>
  }

  return <Form form={form} />
}