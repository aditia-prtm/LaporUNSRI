import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getProfile, logoutUser } from '../services/authService'
import type { UserProfile } from '../types/auth'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { AuthContext } from './auth-context'

type AuthProviderProps = { children: ReactNode }

export function AuthProvider({ children }: AuthProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true

    const syncProfile = async (userId: string) => {
      try {
        const nextProfile = await getProfile(userId)
        if (active) setProfile(nextProfile)
      } catch {
        if (active) setProfile(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) void syncProfile(data.session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setProfile(null)
        setLoading(false)
        return
      }

      // Event TOKEN_REFRESHED terjadi otomatis di background saat tab kembali aktif/fokus.
      // Tidak perlu menyalakan loading screen atau memblokir UI pengguna.
      if (event === 'TOKEN_REFRESHED') {
        return
      }

      // Hanya set loading jika profile belum ada sama sekali (misal login baru)
      setProfile((prev) => {
        if (!prev) setLoading(true)
        return prev
      })

      window.setTimeout(() => void syncProfile(session.user.id), 0)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await logoutUser()
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (!profile?.id) return
    try {
      const updated = await getProfile(profile.id)
      setProfile(updated)
    } catch {
      // Biarkan profile tetap ada jika query refresh gagal
    }
  }

  return (
    <AuthContext.Provider value={{ profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
