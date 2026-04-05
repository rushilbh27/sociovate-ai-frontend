import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // During build-time static prerendering env vars may not be available.
  // Placeholder values are safe because useEffect (where all API calls happen)
  // does not run during SSR.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
  )
}
