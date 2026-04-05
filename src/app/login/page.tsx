"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    router.push("/dashboard")
  }

  async function handleMagicLink() {
    if (!email) { setError("Enter your email first"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) { setError(err.message); setLoading(false); return }
    setLoading(false)
    alert("Check your email for the login link!")
  }

  return (
    <div className="min-h-screen dreamy-bg flex items-center justify-center px-6 relative overflow-hidden">
      {/* Warm decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#9DD9D2]/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F4D06F]/20 blur-3xl rounded-full animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FF8811]/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF8811] mb-8 transition-colors cursor-pointer">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100 shadow-xl shadow-orange-100/40 p-8">
          {/* Cursive logo */}
          <div className="mb-2">
            <span className="font-script text-3xl text-[#FF8811]">Sociovate</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">Sign in to your dashboard</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-[#FF8811] focus:ring-2 focus:ring-[#FF8811]/20 outline-none transition-all bg-white"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-[#FF8811] focus:ring-2 focus:ring-[#FF8811]/20 outline-none transition-all bg-white pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded border-orange-200 accent-[#FF8811]" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#FF8811] hover:underline cursor-pointer">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8811] hover:bg-[#E07300] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer glow-brand-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-orange-100" />
            <span className="text-xs text-gray-400 uppercase">or</span>
            <div className="flex-1 h-px bg-orange-100" />
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full border border-orange-200 hover:border-[#FF8811]/50 text-gray-700 hover:text-[#FF8811] py-3 rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            Send Magic Link
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#FF8811] font-medium hover:underline cursor-pointer">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
