"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (err) { setError(err.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen dreamy-bg flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#9DD9D2]/25 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100 shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF8811]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#FF8811]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/login" className="text-[#FF8811] font-medium hover:underline cursor-pointer">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dreamy-bg flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#9DD9D2]/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#F4D06F]/20 blur-3xl rounded-full animate-float-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF8811] mb-8 transition-colors cursor-pointer">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-orange-100 shadow-xl shadow-orange-100/40 p-8">
          <div className="mb-2">
            <span className="font-script text-3xl text-[#FF8811]">Sociovate</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">Create your account to get started</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-[#FF8811] focus:ring-2 focus:ring-[#FF8811]/20 outline-none transition-all bg-white"
                placeholder="Rushil Bhor"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
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
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8811] hover:bg-[#E07300] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 cursor-pointer glow-brand-sm"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF8811] font-medium hover:underline cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
