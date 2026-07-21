'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface AuthContextType {
  user: any
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isStaff: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = profile?.role === 'admin'
  const isStaff = profile?.role === 'staff' || isAdmin

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)