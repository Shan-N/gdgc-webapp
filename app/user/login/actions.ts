'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

// Function to check if user is authenticated
export async function isAuthenticated() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// Middleware to protect routes
export async function protectRoute() {
  if (!(await isAuthenticated())) {
    redirect('/user/login')
  }
}

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/user/login?message=Check your email to confirm your account')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/user/login')
}