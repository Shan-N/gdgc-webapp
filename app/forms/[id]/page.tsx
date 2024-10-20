import { createClient } from '@/app/utils/supabase/server'
import Form from './components/Form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bebas_Neue } from "next/font/google"
import { AlertCircle, LogIn } from 'lucide-react'


const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
})

interface FormPageProps {
  params: { 
    id: string 
  }
}

export default async function FormPage({ params }: FormPageProps) {
  const supabase = createClient()

  const { data: form } = await supabase
    .from('forms')
    .select('*, questions(*)')
    .eq('id', params.id)
    .single()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-200 via-transparent to-purple-200 opacity-70" />
        <Card className="w-full max-w-md relative z-10 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-base">
              Please sign in to access the form
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <LogIn className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-center text-gray-600 max-w-sm">
              To ensure the security and privacy of your responses, please sign in to your account.
            </p>
            <a href="/user/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                Sign In
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-200 via-transparent to-purple-200 opacity-70" />
        <Card className="w-full max-w-md relative z-10 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-red-600">Form Not Found</CardTitle>
            <CardDescription className="text-base">
              The requested form could not be found
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-center text-gray-600 max-w-sm">
              The form you&apos;re looking for might have been moved, deleted, or never existed.
            </p>
            <a href="/">
              <Button variant="outline" className="w-full">
                Return Home
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-200 via-transparent to-purple-200 opacity-70" />
      
      {/* Header content */}
      <header className="relative z-10 pt-40 md:pt-52 pb-12 md:pb-20 px-12">
        <div className=" mx-auto max-w-7xl">
          <div className={bebasNeue.className}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              {form.title}
            </h1>
          </div>
          
          {form.description && (
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl">
              {form.description}
            </p>
          )}
        </div>
      </header>

      {/* Form content */}
      <main className="relative z-20 px-4 pb-12">
        <div className="container mx-auto max-w-7xl">
          <Form form={form} />
        </div>
      </main>
    </div>
  )
}