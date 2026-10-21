import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getProfile, logoutUser } from '../services/authService'
import type { UserProfile } from '../types/auth'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export type AuthContextValue = {
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null)
        setLoading(false)
        return
      }
      setLoading(true)
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

  return (
    <AuthContext.Provider value={{ profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
