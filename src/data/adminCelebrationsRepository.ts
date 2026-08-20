import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { mapCelebration, type CelebrationWithMedia } from './celebrationsRepository'
import type { Celebration } from '../types/celebrations'
import type { Database } from '../types/supabase'

type CelebrationInsert = Database['public']['Tables']['celebrations']['Insert']

export type CelebrationInput = Omit<CelebrationInsert, 'id' | 'created_at' | 'updated_at' | 'published' | 'featured' | 'cover_url' | 'trailer_url'> & { featured: boolean }

function requireSupabase() {
  if (!supabase) throw new Error('Supabase no está configurado.')
  return supabase
}

async function mapSingle(data: CelebrationWithMedia | null, error: { message: string } | null): Promise<Celebration> {
  if (error) throw new Error(error.message)
  if (!data) throw new Error('No se encontró la celebración.')
  return mapCelebration(data)
}

export async function getAdminCelebrations(): Promise<Celebration[]> {
  const client = requireSupabase()
  const { data, error } = await client.from('celebrations').select('*, media(*)').order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapCelebration)
}

export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  const client = requireSupabase()
  const { data, error } = await client.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle()
  if (error) throw new Error(error.message)
  return Boolean(data)
}

export async function createCelebration(input: CelebrationInput, published = false): Promise<Celebration> {
  const client = requireSupabase()
  const { data, error } = await client.from('celebrations').insert({ ...input, published }).select('*, media(*)').single()
  return mapSingle(data, error)
}

export async function updateCelebration(id: string, input: CelebrationInput, published: boolean): Promise<Celebration> {
  const client = requireSupabase()
  const { data, error } = await client.from('celebrations').update({ ...input, published }).eq('id', id).select('*, media(*)').single()
  return mapSingle(data, error)
}

export async function publishCelebration(id: string): Promise<Celebration> {
  const client = requireSupabase()
  const { data, error } = await client.from('celebrations').update({ published: true }).eq('id', id).select('*, media(*)').single()
  return mapSingle(data, error)
}

export async function unpublishCelebration(id: string): Promise<Celebration> {
  const client = requireSupabase()
  const { data, error } = await client.from('celebrations').update({ published: false }).eq('id', id).select('*, media(*)').single()
  return mapSingle(data, error)
}

export async function signInAdmin(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const client = requireSupabase()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  return { user: data.user, error: error ? 'El correo o la contraseña no son correctos.' : null }
}

export async function signOutAdmin(): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.auth.signOut()
  if (error) throw new Error(error.message)
}
