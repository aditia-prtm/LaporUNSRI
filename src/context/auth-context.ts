import { createContext } from 'react'
import type { UserProfile } from '../types/auth'

export type AuthContextValue = {
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
