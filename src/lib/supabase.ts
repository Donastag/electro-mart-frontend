import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a dummy client if environment variables are not set
const dummyUrl = 'https://dummy.supabase.co'
const dummyKey = 'dummy-key'

const effectiveUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl !== 'your-supabase-url' ? supabaseUrl : dummyUrl
const effectiveKey = supabaseKey && supabaseKey !== 'your-supabase-anon-key' ? supabaseKey : dummyKey

export const supabase = createClient<Database>(
  effectiveUrl,
  effectiveKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-my-custom-header': 'ElecroMart'
      }
    }
  }
)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey &&
           supabaseUrl !== 'your_supabase_project_url' &&
           supabaseKey !== 'your_supabase_anon_key' &&
           supabaseUrl.startsWith('https://'))
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
