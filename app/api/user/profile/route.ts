import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

interface ProfileUpdate {
  username?: string
  full_name?: string
  website?: string
  avatar_url?: string
  current_year?: string
  current_branch?: string
  phone_number?: string
  instagram_url?: string
  github_url?: string
  linkedin_url?: string
  prn?: string
  rfid_tag?: string
}

interface RFIDUpdate {
  operation: 'RFID'
  rfid_tag: string
  prn: string
}

// Validation Schemas
const profileUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  full_name: z.string().min(2).max(100).optional(),
  website: z.string().url().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  current_year: z.enum(['First', 'Second', 'Third', 'Fourth']).optional(),
  current_branch: z.enum([
    'Computer Engineering',
    'Information Technology',
    'Computer Engineering (AIML Edition)',
    'Computer Engineering (Regional Edition)',
    'Electronics and Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering'
  ]).optional(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional().nullable(),
  instagram_url: z.string().url().optional().nullable(),
  github_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  prn: z.string().regex(/^[a-zA-Z0-9]{9}$/).optional()
})

const rfidUpdateSchema = z.object({
  rfid_tag: z.string().min(1),
  prn: z.string().regex(/^[a-zA-Z0-9]{9}$/)
})

// Type guard to check if the request is an RFID update
function isRFIDUpdate(body: unknown): body is RFIDUpdate {
  return (
    typeof body === 'object' &&
    body !== null &&
    'operation' in body &&
    body.operation === 'RFID' &&
    'rfid_tag' in body &&
    'prn' in body
  )
}

// Error Handling
class ProfileError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
    this.name = 'ProfileError'
  }
}

// Profile Service
class ProfileService {
  constructor(private supabase = createClient()) {}

  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error || !user) {
      throw new ProfileError('Not authenticated', 401, 'AUTH_REQUIRED')
    }
    return user
  }

  async hasConsoleAccess(userId: string): Promise<boolean> {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('has_console_access')
      .eq('id', userId)
      .single()
    
    return Boolean(profile?.has_console_access)
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        username, full_name, website, phone_number, avatar_url, 
        current_year, current_branch, prn, github_url, 
        instagram_url, linkedin_url, rfid_tag, has_console_access
      `)
      .eq('id', userId)
      .single()

    if (error) {
      throw new ProfileError('Failed to fetch profile', 400, 'FETCH_FAILED')
    }

    return data
  }

  async updateProfile(userId: string, updates: ProfileUpdate) {
    try {
      // Validate input
      const validatedData = profileUpdateSchema.parse(updates)

      // Use the validated data directly
      const profileUpdates = validatedData
      
      const { data, error } = await this.supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId)
        .select()

      if (error) {
        throw new ProfileError('Failed to update profile', 400, 'UPDATE_FAILED')
      }
      return data
    } 
    catch (error) {
      if (error instanceof z.ZodError) {
        throw new ProfileError('Invalid input data', 400, 'VALIDATION_ERROR')
      }
      throw error
    }
  }

  async updateRFIDTag(updates: RFIDUpdate) {
    try {
      // Validate input
      const validatedData = rfidUpdateSchema.parse(updates)

      const { data, error } = await this.supabase
        .from('profiles')
        .update({ rfid_tag: validatedData.rfid_tag })
        .eq('prn', validatedData.prn)
        .select()

      if (error) {
        throw new ProfileError('Failed to update RFID tag', 400, 'RFID_UPDATE_FAILED')
      }

      return data
    } 
      catch (error) {
      if (error instanceof z.ZodError) {
        throw new ProfileError('Invalid RFID data', 400, 'VALIDATION_ERROR')
      }
      throw error
    }
  }
}

// API Route Handlers
export async function GET() {
  try {
    const profileService = new ProfileService()
    const user = await profileService.getUser()
    const profile = await profileService.getProfile(user.id)
    
    return NextResponse.json({ data: profile })
  } 
    catch (error) {
    if (error instanceof ProfileError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const profileService = new ProfileService()
    const user = await profileService.getUser()
    const body = await request.json()

    if (isRFIDUpdate(body)) {
      // Check console access for RFID updates
      const hasAccess = await profileService.hasConsoleAccess(user.id)
      if (!hasAccess) {
        throw new ProfileError(
          'Not authorized to update RFID tag',
          403,
          'ACCESS_DENIED'
        )
      }
      const data = await profileService.updateRFIDTag(body)
      return NextResponse.json({ data })
    } else {
      const data = await profileService.updateProfile(user.id, body)
      return NextResponse.json({ data })
    }
  } 
  catch (error) {
    if (error instanceof ProfileError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}