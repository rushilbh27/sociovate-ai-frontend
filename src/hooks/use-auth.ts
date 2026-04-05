"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState<string>("")
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function getSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
        setApiKey(user.user_metadata?.api_key || "")
      } catch (err) {
        console.error("Auth error:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
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
  }, [router, supabase])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const isAdmin = user?.user_metadata?.role === "admin"

  return { user, loading, apiKey, isAdmin, signOut }
}
