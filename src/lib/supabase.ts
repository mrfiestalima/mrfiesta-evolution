import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const supabase: SupabaseClient<Database> | null = url && publishableKey ? createClient<Database>(url, publishableKey) : null
export const isSupabaseConfigured = Boolean(supabase)
