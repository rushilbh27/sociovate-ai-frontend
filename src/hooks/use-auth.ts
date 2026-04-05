"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState<string>("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      // api_key stored in user metadata (set during onboarding)
      setApiKey(user.user_metadata?.api_key || "")
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login")
      } else {
        setUser(session.user)
        setApiKey(session.user.user_metadata?.api_key || "")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const isAdmin = user?.user_metadata?.role === "admin"

  return { user, loading, apiKey, isAdmin, signOut }
}
